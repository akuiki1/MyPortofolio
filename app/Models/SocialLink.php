<?php

namespace App\Models;

use Database\Factories\SocialLinkFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $label
 * @property string $handle
 * @property string $url
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['label', 'handle', 'url', 'sort_order'])]
class SocialLink extends Model
{
    /** @use HasFactory<SocialLinkFactory> */
    use HasFactory;
}
