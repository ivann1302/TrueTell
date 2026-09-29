<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\TelegramDelivery;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Throwable;

final class DeliverTelegram extends Command
{
    protected $signature = 'crm:deliver';

    protected $description = 'Send due Telegram notifications; safe for cron without a persistent worker';

    public function handle(): int
    {
        if (! config('crm.telegram.enabled')) {
            return self::SUCCESS;
        }
        $token = config('crm.telegram.token');
        if (! is_string($token) || $token === '') {
            $this->error('Telegram token is not configured.');

            return self::FAILURE;
        }
        $ids = TelegramDelivery::whereNull('sent_at')->whereNull('failed_at')->where('next_attempt_at', '<=', now())->orderBy('id')->limit(10)->pluck('id');
        foreach ($ids as $id) {
            DB::transaction(function () use ($id, $token): void {
                $d = TelegramDelivery::lockForUpdate()->whereKey($id)->first();
                if (! $d || $d->sent_at || $d->failed_at || $d->next_attempt_at?->isFuture()) {
                    return;
                }
                if (! in_array($d->chat_id, config()->array('crm.telegram.recipients'), true)) {
                    $d->update(['failed_at' => now(), 'last_error' => 'recipient_removed']);

                    return;
                }
                $d->attempts++;
                $lead = $d->lead;
                if (! $lead) {
                    return;
                }
                $delay = min(3600, 60 * (2 ** ($d->attempts - 1)));
                $error = 'network_error';
                try {
                    $response = Http::connectTimeout(3)->timeout(8)->post('https://api.telegram.org/bot'.$token.'/sendMessage', [
                        'chat_id' => $d->chat_id,
                        'text' => "🔔 <b>Новая заявка</b>\n\n"
                            .'📋 Номер: <code>'.e($lead->reference)."</code>\n"
                            .'🌐 Источник: сайт '.e(config()->string('crm.brand')),
                        'parse_mode' => 'HTML',
                        'reply_markup' => ['inline_keyboard' => [[[
                            'text' => '📂 Открыть заявку',
                            'url' => rtrim(config()->string('app.url'), '/').'/workspace?lead='.$lead->id,
                        ]]]],
                        'link_preview_options' => ['is_disabled' => true],
                    ]);
                    if ($response->successful() && $response->json('ok') === true) {
                        $d->fill(['sent_at' => now(), 'last_error' => null])->save();

                        return;
                    }
                    $error = 'telegram_http_'.$response->status();
                    if ($response->status() === 429) {
                        $delay = max($delay, min(86400, (is_numeric($response->json('parameters.retry_after')) ? (int) $response->json('parameters.retry_after') : 60)));
                    }
                } catch (Throwable) { /* Never log exception URLs containing the bot token. */
                }
                $d->fill(['last_error' => $error, 'next_attempt_at' => now()->addSeconds($delay), 'failed_at' => $d->attempts >= 5 ? now() : null])->save();
                $this->warn('Delivery '.$d->id.': '.$error);
            });
        }

        return self::SUCCESS;
    }
}
