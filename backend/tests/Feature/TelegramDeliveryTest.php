<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\TelegramDelivery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

final class TelegramDeliveryTest extends TestCase
{
    use RefreshDatabase;

    private function delivery(): TelegramDelivery
    {
        $l = Lead::create(['idempotency_key' => (string) Str::uuid(), 'name' => 'Secret name', 'contact_method' => 'email', 'contact' => 'secret@example.com', 'contact_hash' => Lead::searchHash('secret@example.com'), 'message' => 'Private text', 'page_path' => '/', 'consented_at' => now(), 'consent_version' => 'test']);

        return TelegramDelivery::create(['lead_id' => $l->id, 'chat_id' => '123', 'next_attempt_at' => now()]);
    }

    public function test_disabled_bot_does_not_send_or_consume_attempts(): void
    {
        Http::fake();
        $d = $this->delivery();
        $this->artisan('crm:deliver')->assertSuccessful();
        Http::assertNothingSent();
        $this->assertSame(0, $d->fresh()->attempts);
    }

    public function test_success_is_not_resent_and_contains_no_contact_data(): void
    {
        config(['crm.telegram.enabled' => true, 'crm.telegram.token' => 'test-token', 'crm.telegram.recipients' => ['123']]);
        Http::fake(['*' => Http::response(['ok' => true])]);
        $d = $this->delivery();
        $this->artisan('crm:deliver')->assertSuccessful();
        $this->artisan('crm:deliver')->assertSuccessful();
        Http::assertSentCount(1);
        Http::assertSent(fn ($r) => ! str_contains($r['text'], 'secret@example.com') && ! str_contains($r['text'], 'Private text') && ! str_contains($r['text'], 'Secret name') && $r['parse_mode'] === 'HTML' && str_contains($r['text'], '<b>') && $r['reply_markup']['inline_keyboard'][0][0]['url'] === rtrim(config('app.url'), '/').'/workspace?lead='.$d->lead_id);
        $this->assertNotNull($d->fresh()->sent_at);
    }

    public function test_failed_send_retries_later_without_losing_lead(): void
    {
        config(['crm.telegram.enabled' => true, 'crm.telegram.token' => 'test-token', 'crm.telegram.recipients' => ['123']]);
        Http::fake(['*' => Http::response(['ok' => false], 500)]);
        $d = $this->delivery();
        $this->artisan('crm:deliver')->assertSuccessful();
        $this->artisan('crm:deliver')->assertSuccessful();
        Http::assertSentCount(1);
        $this->assertNull($d->fresh()->sent_at);
        $this->assertSame(1, $d->fresh()->attempts);
        $this->assertDatabaseCount('leads', 1);
    }

    public function test_removed_recipient_is_never_sent(): void
    {
        config(['crm.telegram.enabled' => true, 'crm.telegram.token' => 'test-token', 'crm.telegram.recipients' => ['456']]);
        Http::fake();
        $this->delivery();
        $this->artisan('crm:deliver')->assertSuccessful();
        Http::assertNothingSent();
    }
}
