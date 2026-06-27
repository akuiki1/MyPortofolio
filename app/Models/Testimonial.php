<?php

namespace App\Models;

use App\Enums\TestimonialStatus;
use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $author_name
 * @property string|null $author_role
 * @property string $quote
 * @property string|null $avatar_path
 * @property TestimonialStatus $status
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'author_name',
    'author_role',
    'quote',
    'avatar_path',
    'status',
    'sort_order',
])]
class Testimonial extends Model
{
    /** @use HasFactory<TestimonialFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TestimonialStatus::class,
        ];
    }
}
