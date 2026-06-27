<?php

namespace App\Http\Resources;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/**
 * @mixin ContactMessage
 */
class ContactMessageResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'initials' => $this->initials($this->name),
            'subject' => $this->subject,
            'body' => $this->body,
            'preview' => Str::limit($this->body, 90),
            'budget' => $this->budget,
            'timeline' => $this->timeline,
            'status' => $this->status->value,
            'statusLabel' => $this->status->label(),
            'starred' => $this->starred,
            'createdAt' => $this->created_at?->toIso8601String(),
            'receivedHuman' => $this->created_at?->diffForHumans(),
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
