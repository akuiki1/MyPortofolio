<?php

namespace App\Http\Controllers;

use App\Enums\TestimonialStatus;
use App\Models\ContactMessage;
use App\Models\Project;
use App\Models\Testimonial;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render the admin dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            ...$this->data(),
            'exportMode' => false,
        ]);
    }

    /**
     * Render the print/export view with every dashboard view expanded.
     */
    public function print(): Response
    {
        return Inertia::render('dashboard', [
            ...$this->data(),
            'exportMode' => true,
        ]);
    }

    /**
     * Shared dashboard payload.
     *
     * Shapes match what dashboard.tsx already consumes. These admin-facing,
     * presentation-shaped arrays will be formalised into resources when the
     * CRUD pages land.
     *
     * @return array<string, mixed>
     */
    private function data(): array
    {
        $messages = ContactMessage::query()->latest()->get();
        $projects = Project::query()->orderBy('sort_order')->get();
        $testimonials = Testimonial::query()->orderBy('sort_order')->get();

        return [
            'messages' => $messages->map(fn (ContactMessage $message): array => $this->transformMessage($message))->all(),
            'projects' => $projects->map(fn (Project $project): array => $this->transformProject($project))->all(),
            'testimonials' => $testimonials->map(fn (Testimonial $testimonial): array => [
                'id' => $testimonial->id,
                'name' => $testimonial->author_name,
                'role' => $testimonial->author_role,
                'initials' => $this->initials($testimonial->author_name),
                'quote' => $testimonial->quote,
                'pending' => $testimonial->status === TestimonialStatus::Pending,
            ])->all(),
            'metrics' => [
                'messages' => $messages->count(),
                'projectViews' => (int) $projects->sum('views'),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformMessage(ContactMessage $message): array
    {
        [$body, $body2] = array_pad(explode("\n\n", $message->body, 2), 2, '');

        return [
            'id' => (string) $message->id,
            'name' => $message->name,
            'email' => $message->email,
            'initials' => $this->initials($message->name),
            'preview' => Str::limit($message->body, 70),
            'time' => $message->created_at?->diffForHumans([
                'short' => true,
                'syntax' => CarbonInterface::DIFF_ABSOLUTE,
                'parts' => 1,
            ]) ?? '',
            'starred' => $message->starred,
            'status' => $message->status->value,
            'project' => $message->subject,
            'budget' => $message->budget,
            'timeline' => $message->timeline,
            'received' => $this->received($message->created_at),
            'body' => $body,
            'body2' => $body2,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformProject(Project $project): array
    {
        return [
            'id' => $project->id,
            'name' => $project->title,
            'mono' => $this->initials($project->title),
            'category' => $project->category,
            'status' => $project->status->label(),
            'views' => $project->views > 0 ? number_format($project->views) : '—',
            'updated' => $project->updated_at?->diffForHumans() ?? '',
            // Raw values for the edit form.
            'title' => $project->title,
            'year' => $project->year,
            'description' => $project->description,
            'tags' => $project->tags ?? [],
            'statusValue' => $project->status->value,
            'sortOrder' => $project->sort_order,
            'imageUrl' => $project->image_path ? Storage::disk('public')->url($project->image_path) : null,
        ];
    }

    /**
     * Format a human-readable "received" stamp like the original UI.
     */
    private function received(?CarbonInterface $when): string
    {
        if ($when === null) {
            return '';
        }

        if ($when->isToday()) {
            return 'TODAY, '.$when->format('g:i A');
        }

        if ($when->isYesterday()) {
            return 'YESTERDAY, '.$when->format('g:i A');
        }

        return Str::upper($when->diffForHumans(['parts' => 1]));
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
