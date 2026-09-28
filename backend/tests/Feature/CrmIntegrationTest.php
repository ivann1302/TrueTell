<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

final class CrmIntegrationTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role = 'admin'): User
    {
        $u = User::factory()->create();
        $u->forceFill(['role' => $role, 'totp_confirmed_at' => now(), 'totp_secret' => (new Google2FA)->generateSecretKey()])->save();

        return $u;
    }

    private function payload(): array
    {
        return ['idempotency_key' => (string) Str::uuid(), 'name' => 'Анна', 'contact_method' => 'email', 'contact' => 'anna@example.com', 'message' => '<script>alert(1)</script>', 'consent' => true, 'page_path' => '/', 'website' => ''];
    }

    public function test_data_is_encrypted_but_can_be_searched_and_is_escaped_in_views(): void
    {
        $this->postJson('/api/leads', $this->payload())->assertCreated();
        $lead = Lead::firstOrFail();
        $raw = DB::table('leads')->first();
        $this->assertNotSame('anna@example.com', $raw->contact);
        $this->assertNotSame('Анна', $raw->name);
        $this->assertStringNotContainsString('<script>', $raw->message);
        $this->actingAs($this->user())->withSession(['two_factor_verified' => true])->get('/workspace?search=anna@example.com&lead='.$lead->id)->assertOk()->assertSee('Анна')->assertSee('&lt;script&gt;alert(1)&lt;/script&gt;', false)->assertDontSee('<script>alert(1)</script>', false)->assertHeader('X-Robots-Tag', 'noindex, nofollow');
        $this->get('/workspace?search='.$lead->reference)->assertOk()->assertSee('Анна');
        $this->get('/workspace/users')->assertOk()->assertSee('Добавить сотрудника');
    }

    public function test_invalid_phone_with_too_few_digits_cannot_be_submitted(): void
    {
        $p = $this->payload();
        $p['contact_method'] = 'phone';
        $p['contact'] = '(1) -- 2';
        $this->postJson('/api/leads', $p)->assertUnprocessable()->assertJsonValidationErrors('contact');
    }

    public function test_intake_throttle_limits_abuse(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/leads', $this->payload())->assertCreated();
        }
        $this->postJson('/api/leads', $this->payload())->assertStatus(429);
        $this->assertDatabaseCount('leads', 5);
    }

    public function test_csrf_is_required_outside_test_bypass(): void
    {
        $this->app->instance('env', 'local');
        $this->postJson('/api/leads', $this->payload())->assertStatus(419);
        $this->assertDatabaseCount('leads', 0);
    }

    public function test_first_login_enrolls_totp_before_allowing_access(): void
    {
        $u = User::factory()->create();
        $this->post('/workspace/login', ['email' => $u->email, 'password' => 'password'])->assertRedirect('/workspace/two-factor');
        $this->get('/workspace')->assertRedirect('/workspace/two-factor');
        $this->get('/workspace/two-factor')->assertOk()->assertSee('Ключ для настройки');
        $secret = session('totp_enrollment');
        $code = (new Google2FA)->getCurrentOtp($secret);
        $this->post('/workspace/two-factor', ['code' => $code])->assertRedirect('/workspace');
        $this->assertNotNull($u->fresh()->totp_confirmed_at);
        $this->app['auth']->forgetGuards();
        $this->get('/workspace')->assertOk();
        $raw = DB::table('users')->where('id', $u->id)->value('totp_secret');
        $this->assertNotSame($secret, $raw);
    }

    public function test_staff_created_then_disabled_has_sessions_revoked(): void
    {
        $admin = $this->user();
        $this->actingAs($admin)->withSession(['two_factor_verified' => true]);
        $this->post('/workspace/users', ['name' => 'Сотрудник', 'email' => 'NEW@example.com', 'password' => 'LongPassword2026!', 'password_confirmation' => 'LongPassword2026!', 'role' => 'admin'])->assertRedirect();
        $staff = User::where('email', 'new@example.com')->firstOrFail();
        $this->assertSame('staff', $staff->role);
        DB::table('sessions')->insert(['id' => 'test-session', 'user_id' => $staff->id, 'payload' => 'test', 'last_activity' => time()]);
        $this->post('/workspace/users/'.$staff->id.'/toggle')->assertRedirect();
        $this->assertFalse($staff->fresh()->active);
        $this->assertDatabaseMissing('sessions', ['id' => 'test-session']);
        $this->post('/workspace/users/'.$staff->id.'/toggle')->assertRedirect();
        $this->assertTrue($staff->fresh()->active);
    }

    public function test_expired_pending_authentication_requires_password_again(): void
    {
        $this->actingAs($this->user())->withSession(['auth_started_at' => time() - 601])->get('/workspace/two-factor')->assertRedirect('/workspace/login');
        $this->assertGuest();
    }

    public function test_initial_admin_and_recovery_are_cli_only(): void
    {
        $this->artisan('crm:admin', ['email' => 'owner@example.com', 'name' => 'Owner'])->expectsQuestion('Password (14+ characters, letters and numbers)', 'StrongPassword12345')->assertSuccessful();
        $owner = User::where('email', 'owner@example.com')->firstOrFail();
        $this->assertSame('admin', $owner->role);
        $this->artisan('crm:reset-access', ['email' => 'owner@example.com'])->expectsConfirmation('Identity verified? Reset password, TOTP and all sessions?', 'yes')->expectsQuestion('New password (14+ characters, letters and numbers)', 'AnotherPassword12345')->assertSuccessful();
        $this->assertNull($owner->fresh()->totp_secret);
        $this->get('/register')->assertNotFound();
    }
}
