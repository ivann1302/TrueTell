<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\User;
use App\Providers\AppServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

final class WorkspaceSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function verified(string $role = 'staff'): User
    {
        $u = User::factory()->create();
        $u->forceFill(['role' => $role, 'totp_secret' => (new Google2FA)->generateSecretKey(), 'totp_confirmed_at' => now()])->save();

        return $u;
    }

    public function test_existing_totp_user_can_login_with_password_only(): void
    {
        $u = $this->verified();
        $this->post('/workspace/login', ['email' => $u->email, 'password' => 'password'])->assertRedirect('/workspace');
        $this->get('/workspace')->assertOk();
    }

    public function test_staff_cannot_manage_users(): void
    {
        $this->actingAs($this->verified())->post('/workspace/users', [])->assertForbidden();
    }

    public function test_disabled_user_is_logged_out(): void
    {
        $u = $this->verified();
        $u->forceFill(['active' => false])->save();
        $this->actingAs($u)->get('/workspace')->assertRedirect('/workspace/login');
        $this->assertGuest();
    }

    public function test_status_change_records_actor(): void
    {
        $u = $this->verified();
        $l = Lead::create(['idempotency_key' => (string) Str::uuid(), 'contact_method' => 'email', 'contact' => 'a@example.com', 'contact_hash' => Lead::searchHash('a@example.com'), 'page_path' => '/', 'consented_at' => now(), 'consent_version' => 'test']);
        $this->actingAs($u)->post('/workspace/leads/'.$l->id.'/status', ['status' => 'processed'])->assertRedirect();
        $this->assertDatabaseHas('leads', ['id' => $l->id, 'status' => 'processed']);
        $this->assertDatabaseHas('lead_audits', ['lead_id' => $l->id, 'user_id' => $u->id, 'status' => 'processed']);
    }

    public function test_second_factor_endpoints_are_removed(): void
    {
        $this->actingAs($this->verified());
        $this->get('/workspace/two-factor')->assertNotFound();
        $this->post('/workspace/two-factor', ['code' => '123456'])->assertNotFound();
    }

    public function test_login_throttle_still_limits_password_attempts(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->post('/workspace/login', ['email' => 'unknown@example.com', 'password' => 'wrong'])->assertSessionHasErrors('email');
        }
        $this->post('/workspace/login', ['email' => 'unknown@example.com', 'password' => 'wrong'])->assertStatus(429);
        $this->assertGuest();
    }

    public function test_admin_cannot_disable_self(): void
    {
        $u = $this->verified('admin');
        $this->actingAs($u)->post('/workspace/users/'.$u->id.'/toggle')->assertForbidden();
    }

    public function test_wrong_password_and_disabled_user_have_same_error(): void
    {
        $u = $this->verified();
        $u->forceFill(['active' => false])->save();
        $this->post('/workspace/login', ['email' => $u->email, 'password' => 'password'])->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_production_proxy_urls_remain_https(): void
    {
        $this->app->instance('env', 'production');
        config(['app.url' => 'https://truetell-retail.ru']);
        (new AppServiceProvider($this->app))->boot();
        $this->withHeaders(['Host' => 'truetell-retail.ru', 'X-Forwarded-Proto' => 'https'])->get('/workspace/login')->assertOk()->assertSee('action="https://truetell-retail.ru/workspace/login"', false);
    }
}
