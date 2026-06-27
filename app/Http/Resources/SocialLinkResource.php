<?php

namespace App\Http\Resources;

use App\Models\SocialLink;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SocialLink
 */
class SocialLinkResource extends JsonResource
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
            'label' => $this->label,
            'handle' => $this->handle,
            'url' => $this->url,
            'sortOrder' => $this->sort_order,
        ];
    }
}
