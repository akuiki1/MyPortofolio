<?php

namespace App\Models;

use Database\Factories\ProfileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $role
 * @property string|null $tagline
 * @property string|null $bio
 * @property string|null $location
 * @property string|null $experience
 * @property string|null $focus
 * @property string|null $availability_status
 * @property string|null $email
 * @property string|null $avatar_path
 * @property array<int, array{value: int|float, suffix: string, label: string}>|null $stats
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'role',
    'tagline',
    'bio',
    'location',
    'experience',
    'focus',
    'availability_status',
    'email',
    'avatar_path',
    'stats',
])]
class Profile extends Model
{
    /** @use HasFactory<ProfileFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stats' => 'array',
        ];
    }
}
