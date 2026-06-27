<?php

use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests cannot create projects', function () {
    $this->post(route('admin.projects.store'), [])->assertRedirect(route('login'));
});

test('non-admin users cannot create projects', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.projects.store'), [])
        ->assertForbidden();
});

test('an admin can create a project', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->from(route('dashboard'))
        ->post(route('admin.projects.store'), [
            'title' => 'Aurora Platform',
            'category' => 'SaaS',
            'year' => '2026',
            'description' => 'A bright new build.',
            'tags' => ['React', 'Laravel'],
            'status' => 'published',
        ])
        ->assertRedirect(route('dashboard'));

    $project = Project::query()->firstOrFail();

    expect($project->title)->toBe('Aurora Platform')
        ->and($project->slug)->toBe('aurora-platform')
        ->and($project->status)->toBe(ProjectStatus::Published)
        ->and($project->tags)->toBe(['React', 'Laravel']);
});

test('creating a project requires a title and category', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.projects.store'), ['status' => 'draft'])
        ->assertSessionHasErrors(['title', 'category']);

    expect(Project::count())->toBe(0);
});

test('an admin can upload a project image', function () {
    Storage::fake('public');

    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.projects.store'), [
            'title' => 'With Image',
            'category' => 'Web',
            'status' => 'published',
            'image' => UploadedFile::fake()->image('shot.jpg'),
        ]);

    $project = Project::query()->firstOrFail();

    expect($project->image_path)->not->toBeNull();
    Storage::disk('public')->assertExists($project->image_path);
});

test('an admin can update a project and the slug follows the title', function () {
    $project = Project::factory()->create(['title' => 'Old Name', 'slug' => 'old-name']);

    $this->actingAs(User::factory()->admin()->create())
        ->from(route('dashboard'))
        ->post(route('admin.projects.update', $project), [
            'title' => 'New Name',
            'category' => $project->category,
            'status' => 'published',
        ])
        ->assertRedirect(route('dashboard'));

    $project->refresh();

    expect($project->title)->toBe('New Name')
        ->and($project->slug)->toBe('new-name');
});

test('updating a project replaces the old image', function () {
    Storage::fake('public');

    $oldPath = UploadedFile::fake()->image('old.jpg')->store('projects', 'public');
    $project = Project::factory()->create(['image_path' => $oldPath]);

    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.projects.update', $project), [
            'title' => $project->title,
            'category' => $project->category,
            'status' => 'published',
            'image' => UploadedFile::fake()->image('new.jpg'),
        ]);

    $project->refresh();

    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($project->image_path);
});

test('an admin can delete a project and its image', function () {
    Storage::fake('public');

    $path = UploadedFile::fake()->image('shot.jpg')->store('projects', 'public');
    $project = Project::factory()->create(['image_path' => $path]);

    $this->actingAs(User::factory()->admin()->create())
        ->delete(route('admin.projects.destroy', $project))
        ->assertRedirect();

    expect(Project::find($project->id))->toBeNull();
    Storage::disk('public')->assertMissing($path);
});
