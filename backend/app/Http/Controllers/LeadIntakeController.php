<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\TelegramDelivery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

final class LeadIntakeController extends Controller
{
    public function session(Request $request): JsonResponse
    {
        return response()->json(['csrf_token' => $request->session()->token()]);
    }

    public function store(Request $request): JsonResponse
    {
        $contactRules = match ($request->input('contact_method')) {
            'email' => ['email:rfc', 'max:254'],
            'phone' => ['regex:/^\+?(?=(?:\D*\d){7,15}\D*$)[0-9 ()-]{7,25}$/', 'min:7', 'max:25'],
            'telegram' => ['regex:/^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/'],
            default => [],
        };
        $data = $request->validate([
            'idempotency_key' => ['required', 'uuid'], 'name' => ['nullable', 'string', 'max:120'],
            'contact_method' => ['required', Rule::in(['email', 'phone', 'telegram'])],
            'contact' => array_merge(['required', 'string'], $contactRules),
            'message' => ['nullable', 'string', 'max:5000'], 'consent' => ['required', 'accepted'],
            'website' => ['nullable', 'string', 'max:0'],
            'page_path' => ['required', 'string', 'max:512', 'regex:~^/(?!/)[^?#\r\n]*$~'],
            'source' => ['nullable', 'string', 'max:200'],
            'utm' => ['nullable', 'array:utm_source,utm_medium,utm_campaign,utm_content,utm_term'],
            'utm.*' => ['nullable', 'string', 'max:200'],
        ], ['contact.regex' => 'Проверьте контакт: телефон или Telegram @username.', 'consent.accepted' => 'Необходимо согласие на обработку данных.']);
        DB::transaction(function () use ($data): void {
            // The unique key handles overlapping submissions, not only sequential retries.
            $lead = Lead::firstOrCreate(['idempotency_key' => $data['idempotency_key']], [
                'name' => $data['name'] ?? null, 'name_hash' => isset($data['name']) ? Lead::searchHash($data['name']) : null,
                'contact_method' => $data['contact_method'], 'contact' => $data['contact'], 'contact_hash' => Lead::searchHash($data['contact']),
                'message' => $data['message'] ?? null, 'page_path' => $data['page_path'], 'source' => $data['source'] ?? null,
                'utm' => $data['utm'] ?? null, 'consented_at' => now(), 'consent_version' => config('crm.consent_version'),
            ]);
            if ($lead->wasRecentlyCreated && config('crm.telegram.enabled')) {
                foreach (config()->array('crm.telegram.recipients') as $chatId) {
                    TelegramDelivery::create(['lead_id' => $lead->id, 'chat_id' => $chatId, 'next_attempt_at' => now()]);
                }
            }
        });

        return response()->json(['ok' => true], 201);
    }
}
