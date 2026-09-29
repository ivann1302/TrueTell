<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

final class CrmIntegrationTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role = 'admin'): User
    {
        $u = User::factory()->create();
        $u->forceFill(['role' => $role])->save();

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
        $this->actingAs($this->user())->get('/workspace?search=anna@example.com&lead='.$lead->id)->assertOk()->assertSee('Анна')->assertSee('&lt;script&gt;alert(1)&lt;/script&gt;', false)->assertDontSee('<script>alert(1)</script>', false)->assertHeader('X-Robots-Tag', 'noindex, nofollow');
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

    public function test_password_login_opens_workspace_without_a_second_factor(): void
    {
        $u = User::factory()->create();
        $this->post('/workspace/login', ['email' => $u->email, 'password' => 'password'])->assertRedirect('/workspace');
        $this->app['auth']->forgetGuards();
        $this->get('/workspace')->assertOk()->assertSee('main-nav')->assertSee('workspace/logout');
        $this->assertAuthenticatedAs($u);
        $this->assertNull($u->fresh()->totp_secret);
    }

    public function test_staff_created_then_disabled_has_sessions_revoked(): void
    {
        $admin = $this->user();
        $this->actingAs($admin);
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

    public function test_logout_revokes_access_to_workspace(): void
    {
        $this->actingAs($this->user())->post('/workspace/logout')->assertRedirect('/workspace/login');
        $this->get('/workspace')->assertRedirect('/workspace/login');
        $this->assertGuest();
    }

    public function test_initial_admin_and_recovery_are_cli_only(): void
    {
        $this->artisan('crm:admin', ['email' => 'owner@example.com', 'name' => 'Owner'])->expectsQuestion('Password (14+ characters, letters and numbers)', 'StrongPassword12345')->assertSuccessful();
        $owner = User::where('email', 'owner@example.com')->firstOrFail();
        $this->assertSame('admin', $owner->role);
        $this->artisan('crm:reset-access', ['email' => 'owner@example.com'])->expectsConfirmation('Identity verified? Reset password and all sessions?', 'yes')->expectsQuestion('New password (14+ characters, letters and numbers)', 'AnotherPassword12345')->assertSuccessful();
        $this->assertNull($owner->fresh()->totp_secret);
        $this->get('/register')->assertNotFound();
    }
}
