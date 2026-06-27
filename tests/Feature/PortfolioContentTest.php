<?php

use App\Enums\ProjectStatus;
use App\Enums\TestimonialStatus;
use App\Http\Resources\ContactMessageResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TestimonialResource;
use App\Models\ContactMessage;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Testimonial;
use Database\Seeders\PortfolioSeeder;

test('project casts status to an enum and tags to an array', function () {
    $project = Project::factory()->create(['tags' => ['React', 'Laravel']]);

    expect($project->status)->toBeInstanceOf(ProjectStatus::class)
        ->and($project->tags)->toBe(['React', 'Laravel']);
});

test('factory states set the expected status', function () {
    expect(Project::factory()->draft()->create()->status)->toBe(ProjectStatus::Draft)
        ->and(Testimonial::factory()->pending()->create()->status)->toBe(TestimonialStatus::Pending)
        ->and(Skill::factory()->inTicker()->create()->in_ticker)->toBeTrue();
});

test('project resource exposes status value, label and image url', function () {
    $project = Project::factory()->create([
        'status' => ProjectStatus::Published,
        'image_path' => null,
    ]);

    $data = (new ProjectResource($project))->toArray(request());

    expect($data['status'])->toBe('published')
        ->and($data['statusLabel'])->toBe('Published')
        ->and($data['imageUrl'])->toBeNull()
        ->and($data['tags'])->toBeArray();
});

test('resources derive two-letter initials from names', function () {
    $testimonial = Testimonial::factory()->create(['author_name' => 'Sarah Lin']);
    $message = ContactMessage::factory()->create(['name' => 'Andre Pratama']);

    expect((new TestimonialResource($testimonial))->toArray(request())['initials'])->toBe('SL')
        ->and((new ContactMessageResource($message))->toArray(request())['initials'])->toBe('AP');
});

test('portfolio seeder loads the current hardcoded content into the database', function () {
    $this->seed(PortfolioSeeder::class);

    expect(Project::count())->toBe(6)
        ->and(Project::where('status', ProjectStatus::Published)->count())->toBe(5)
        ->and(Skill::count())->toBe(21)
        ->and(Skill::where('in_ticker', true)->count())->toBe(12)
        ->and(ContactMessage::count())->toBe(7);
});

test('the portfolio seeder is idempotent', function () {
    $this->seed(PortfolioSeeder::class);
    $this->seed(PortfolioSeeder::class);

    expect(Project::count())->toBe(6)
        ->and(ContactMessage::count())->toBe(7);
});
