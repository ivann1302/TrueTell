<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

final class ComplaintIntakeTest extends TestCase
{
    use RefreshDatabase;

    private function payload(): array
    {
        return ['idempotency_key' => (string) Str::uuid(), 'application' => 'cleaner', 'name' => 'Анна', 'contact_method' => 'telegram', 'contact' => '@example_anna', 'message' => 'Не открывается список сделок', 'consent' => true, 'page_path' => '/complaints/', 'source' => 'Подменённое название', 'website' => ''];
    }

    public function test_complaint_uses_registered_application_and_encrypted_crm_message(): void
    {
        $this->postJson('/api/complaints', $this->payload())->assertCreated()->assertJson(['ok' => true]);
        $lead = Lead::firstOrFail();
        $this->assertSame('Жалоба · Массовое удаление лидов и сделок', $lead->source);
        $this->assertSame('/complaints/', $lead->page_path);
        $this->assertSame("Приложение: Массовое удаление лидов и сделок\n\nНе открывается список сделок", $lead->message);
        $this->assertStringNotContainsString('Не открывается', $lead->getRawOriginal('message'));
    }

    public function test_unknown_application_and_empty_problem_cannot_bypass_client_validation(): void
    {
        $data = $this->payload();
        $data['application'] = 'invented-app';
        $data['message'] = '   ';
        $this->postJson('/api/complaints', $data)->assertUnprocessable()->assertJsonValidationErrors(['application', 'message']);
        unset($data['application']);
        $this->postJson('/api/complaints', $data)->assertUnprocessable()->assertJsonValidationErrors('application');
        $this->assertDatabaseCount('leads', 0);
    }

    public function test_retry_creates_one_complaint_and_one_delivery_per_existing_recipient(): void
    {
        config(['crm.telegram.enabled' => true, 'crm.telegram.recipients' => ['123', '456']]);
        $data = $this->payload();
        $this->postJson('/api/complaints', $data)->assertCreated();
        $this->postJson('/api/complaints', $data)->assertSuccessful();
        $this->assertDatabaseCount('leads', 1);
        $this->assertDatabaseCount('telegram_deliveries', 2);
    }

    public function test_all_complaint_contact_methods_validate_their_format(): void
    {
        $client = 1;
        foreach (['telegram' => '@example_anna', 'phone' => '+7 (999) 123-45-67', 'max' => '+7 (999) 123-45-67', 'whatsapp' => '+7 (999) 123-45-67'] as $method => $contact) {
            $this->withServerVariables(['REMOTE_ADDR' => '192.0.2.'.$client++]);
            $data = $this->payload();
            $data['contact_method'] = $method;
            $data['contact'] = 'wrong';
            $this->postJson('/api/complaints', $data)->assertUnprocessable()->assertJsonValidationErrors('contact');
            $data['contact'] = $contact;
            $this->postJson('/api/complaints', $data)->assertCreated();
        }
        $this->assertDatabaseCount('leads', 4);
    }

    public function test_honeypot_and_missing_consent_do_not_create_complaints(): void
    {
        $data = $this->payload();
        $data['website'] = 'spam';
        $data['consent'] = false;
        $this->postJson('/api/complaints', $data)->assertUnprocessable()->assertJsonValidationErrors(['website', 'consent']);
        $this->assertDatabaseCount('leads', 0);
    }

    public function test_reused_key_with_changed_complaint_returns_conflict(): void
    {
        $data = $this->payload();
        $this->postJson('/api/complaints', $data)->assertCreated();
        $data['message'] = 'Уточнённая проблема';
        $this->postJson('/api/complaints', $data)->assertStatus(409)->assertJson(['ok' => false]);
        $this->assertDatabaseCount('leads', 1);
        $this->assertStringContainsString('Не открывается', Lead::firstOrFail()->message);
    }
}
