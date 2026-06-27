<?php

namespace App\Http\Resources;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin Project
 */
class ProjectResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'category' => $this->category,
            'year' => $this->year,
            'description' => $this->description,
            'tags' => $this->tags ?? [],
            'imageUrl' => $this->image_path ? Storage::disk('public')->url($this->image_path) : null,
            'status' => $this->status->value,
            'statusLabel' => $this->status->label(),
            'views' => $this->views,
            'sortOrder' => $this->sort_order,
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
