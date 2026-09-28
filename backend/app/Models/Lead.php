<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string|null $name
 * @property string $contact_method
 * @property string $contact
 * @property string|null $message
 * @property string $status
 * @property string $reference
 */
final class Lead extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['name' => 'encrypted', 'contact' => 'encrypted', 'message' => 'encrypted', 'utm' => 'array', 'consented_at' => 'datetime'];
    }

    /** @return list<string> */
    public function uniqueIds(): array
    {
        return ['id'];
    }

    public function getReferenceAttribute(): string
    {
        return strtoupper(substr($this->id, -12));
    }

    /** @return HasMany<LeadAudit, $this> */
    public function audits(): HasMany
    {
        return $this->hasMany(LeadAudit::class)->latest();
    }

    public static function searchHash(string $value): string
    {
        return hash_hmac('sha256', mb_strtolower(trim($value)), config()->string('app.key'));
    }
}
