<?php

namespace App\Models;

use App\Enums\MessageStatus;
use Database\Factories\ContactMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $subject
 * @property string $body
 * @property string|null $budget
 * @property string|null $timeline
 * @property MessageStatus $status
 * @property bool $starred
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'email',
    'subject',
    'body',
    'budget',
    'timeline',
    'status',
    'starred',
])]
class ContactMessage extends Model
{
    /** @use HasFactory<ContactMessageFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => MessageStatus::class,
            'starred' => 'boolean',
        ];
    }
}
