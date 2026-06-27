<?php

use App\Models\Profile;
use App\Models\Project;
use App\Models\Testimonial;
use Database\Seeders\PortfolioSeeder;
use Inertia\Testing\AssertableInertia;

test('the home page renders the portfolio landing page', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('welcome'));
});

test('the home page renders even when no content has been seeded', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('welcome')
            ->where('profile', null)
            ->has('projects', 0)
            ->has('testimonials', 0));
});

test('the home page exposes seeded content as props', function () {
    $this->seed(PortfolioSeeder::class);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('welcome')
            ->where('profile.name', 'Rizki Syandana')
            ->has('projects', 5)
            ->has('testimonials', 3)
            ->has('services', 4)
            ->has('skills', 21)
            ->has('socials', 4));
});

test('the home page only exposes published projects', function () {
    Project::factory()->create(['title' => 'Public One']);
    Project::factory()->draft()->create(['title' => 'Hidden Draft']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->has('projects', 1)
            ->where('projects.0.title', 'Public One'));
});

test('the home page only exposes approved testimonials', function () {
    Profile::factory()->create();
    Testimonial::factory()->create();
    Testimonial::factory()->pending()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->has('testimonials', 1));
});
