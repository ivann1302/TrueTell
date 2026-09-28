<?php

declare(strict_types=1);
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t): void {
            $t->string('role')->default('staff');
            $t->boolean('active')->default(true);
            $t->text('totp_secret')->nullable();
            $t->timestamp('totp_confirmed_at')->nullable();
            $t->unsignedBigInteger('totp_last_step')->nullable();
        });
        Schema::create('leads', function (Blueprint $t): void {
            $t->uuid('id')->primary();
            $t->uuid('idempotency_key')->unique();
            $t->text('name')->nullable();
            $t->string('name_hash', 64)->nullable()->index();
            $t->string('contact_method', 16);
            $t->text('contact');
            $t->string('contact_hash', 64)->index();
            $t->text('message')->nullable();
            $t->string('page_path', 512);
            $t->string('source', 200)->nullable();
            $t->json('utm')->nullable();
            $t->string('status', 16)->default('new')->index();
            $t->timestamp('consented_at');
            $t->string('consent_version', 32);
            $t->timestamps();
            $t->index('created_at');
        });
        Schema::create('lead_audits', function (Blueprint $t): void {
            $t->id();
            $t->foreignUuid('lead_id')->constrained('leads')->cascadeOnDelete();
            $t->foreignId('user_id')->constrained('users');
            $t->string('status', 16);
            $t->timestamps();
        });
        Schema::create('telegram_deliveries', function (Blueprint $t): void {
            $t->id();
            $t->foreignUuid('lead_id')->constrained('leads')->cascadeOnDelete();
            $t->string('chat_id');
            $t->unsignedTinyInteger('attempts')->default(0);
            $t->timestamp('next_attempt_at')->nullable();
            $t->timestamp('sent_at')->nullable();
            $t->timestamp('failed_at')->nullable();
            $t->string('last_error')->nullable();
            $t->timestamps();
            $t->unique(['lead_id', 'chat_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_deliveries');
        Schema::dropIfExists('lead_audits');
        Schema::dropIfExists('leads');
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn(['role', 'active', 'totp_secret', 'totp_confirmed_at', 'totp_last_step']));
    }
};
