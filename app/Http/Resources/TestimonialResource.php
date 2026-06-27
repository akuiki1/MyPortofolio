<?php

namespace App\Http\Resources;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @mixin Testimonial
 */
class TestimonialResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'authorName' => $this->author_name,
            'authorRole' => $this->author_role,
            'quote' => $this->quote,
            'initials' => $this->initials($this->author_name),
            'avatarUrl' => $this->avatar_path ? Storage::disk('public')->url($this->avatar_path) : null,
            'status' => $this->status->value,
            'statusLabel' => $this->status->label(),
            'sortOrder' => $this->sort_order,
        ];
    }

    /**
     * Build up to two-letter initials from a name.
     */
    private function initials(string $name): string
    {
        return Str::of($name)
            ->explode(' ')
            ->filter()
            ->take(2)
            ->map(fn (string $part): string => Str::upper(Str::substr($part, 0, 1)))
            ->implode('');
    }
}
