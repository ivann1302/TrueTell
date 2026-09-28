<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

final class LeadIntakeTest extends TestCase
{
    use RefreshDatabase;

    private function payload(): array
    {
        return ['idempotency_key' => (string) Str::uuid(), 'name' => 'Анна', 'contact_method' => 'telegram', 'contact' => '@example_anna', 'message' => 'Нужна интеграция', 'consent' => true, 'page_path' => '/backup-moysklad/', 'source' => 'МойСклад', 'website' => ''];
    }

    public function test_valid_lead_is_stored_once_without_bot(): void
    {
        $data = $this->payload();
        $this->postJson('/api/leads', $data)->assertCreated()->assertJson(['ok' => true]);
        $this->postJson('/api/leads', $data)->assertSuccessful();
        $this->assertDatabaseCount('leads', 1);
        $this->assertDatabaseCount('telegram_deliveries', 0);
    }

    public function test_invalid_contact_and_missing_consent_do_not_store(): void
    {
        $data = $this->payload();
        $data['contact'] = 'bad';
        $data['consent'] = false;
        $this->postJson('/api/leads', $data)->assertUnprocessable()->assertJsonValidationErrors(['contact', 'consent']);
        $this->assertDatabaseCount('leads', 0);
    }

    public function test_honeypot_does_not_store(): void
    {
        $data = $this->payload();
        $data['website'] = 'spam';
        $this->postJson('/api/leads', $data)->assertUnprocessable();
        $this->assertDatabaseCount('leads', 0);
    }

    public function test_recipient_deliveries_are_created_only_when_enabled(): void
    {
        config(['crm.telegram.enabled' => true, 'crm.telegram.recipients' => ['123', '456']]);
        $this->postJson('/api/leads', $this->payload())->assertCreated();
        $this->assertDatabaseCount('telegram_deliveries', 2);
    }

    public function test_private_routes_require_authentication(): void
    {
        $this->get('/workspace')->assertRedirect('/workspace/login');
        $this->getJson('/workspace')->assertUnauthorized();
    }
}
