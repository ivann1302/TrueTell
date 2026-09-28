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

    public function test_password_only_does_not_allow_leads(): void
    {
        $u = $this->verified();
        $this->actingAs($u)->get('/workspace')->assertRedirect('/workspace/two-factor');
    }

    public function test_staff_cannot_manage_users(): void
    {
        $this->actingAs($this->verified())->withSession(['two_factor_verified' => true])->post('/workspace/users', [])->assertForbidden();
    }

    public function test_disabled_user_is_logged_out(): void
    {
        $u = $this->verified();
        $u->forceFill(['active' => false])->save();
        $this->actingAs($u)->withSession(['two_factor_verified' => true])->get('/workspace')->assertRedirect('/workspace/login');
        $this->assertGuest();
    }

    public function test_status_change_records_actor(): void
    {
        $u = $this->verified();
        $l = Lead::create(['idempotency_key' => (string) Str::uuid(), 'contact_method' => 'email', 'contact' => 'a@example.com', 'contact_hash' => Lead::searchHash('a@example.com'), 'page_path' => '/', 'consented_at' => now(), 'consent_version' => 'test']);
        $this->actingAs($u)->withSession(['two_factor_verified' => true])->post('/workspace/leads/'.$l->id.'/status', ['status' => 'processed'])->assertRedirect();
        $this->assertDatabaseHas('leads', ['id' => $l->id, 'status' => 'processed']);
        $this->assertDatabaseHas('lead_audits', ['lead_id' => $l->id, 'user_id' => $u->id, 'status' => 'processed']);
    }

    public function test_totp_code_cannot_be_reused(): void
    {
        $u = $this->verified();
        $code = (new Google2FA)->getCurrentOtp($u->totp_secret);
        $this->actingAs($u)->withSession(['auth_started_at' => time()])->post('/workspace/two-factor', ['code' => $code])->assertRedirect('/workspace');
        $this->withSession(['two_factor_verified' => false, 'auth_started_at' => time()])->post('/workspace/two-factor', ['code' => $code])->assertSessionHasErrors('code');
    }

    public function test_admin_cannot_disable_self(): void
    {
        $u = $this->verified('admin');
        $this->actingAs($u)->withSession(['two_factor_verified' => true])->post('/workspace/users/'.$u->id.'/toggle')->assertForbidden();
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
