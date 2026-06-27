<?php

namespace App\Http\Resources;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin Profile
 */
class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'role' => $this->role,
            'tagline' => $this->tagline,
            'bio' => $this->bio,
            'location' => $this->location,
            'experience' => $this->experience,
            'focus' => $this->focus,
            'availabilityStatus' => $this->availability_status,
            'email' => $this->email,
            'avatarUrl' => $this->avatar_path ? Storage::disk('public')->url($this->avatar_path) : null,
            'stats' => $this->stats ?? [],
            'facts' => array_values(array_filter([
                $this->location ? ['k' => 'Location', 'v' => $this->location] : null,
                $this->experience ? ['k' => 'Experience', 'v' => $this->experience] : null,
                $this->focus ? ['k' => 'Focus', 'v' => $this->focus] : null,
                $this->availability_status ? ['k' => 'Status', 'v' => $this->availability_status] : null,
            ])),
        ];
    }
}
