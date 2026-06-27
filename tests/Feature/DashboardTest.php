<?php

use App\Models\User;
use Database\Seeders\PortfolioSeeder;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('non-admin users cannot visit the dashboard', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('dashboard'))->assertForbidden();
});

test('admin users can visit the dashboard', function () {
    $this->actingAs(User::factory()->admin()->create());

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('dashboard'));
});

test('the dashboard exposes seeded content to the admin', function () {
    $this->seed(PortfolioSeeder::class);
    $this->actingAs(User::factory()->admin()->create());

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dashboard')
            ->where('exportMode', false)
            ->has('projects', 6)
            ->has('messages', 7)
            ->has('testimonials', 4)
            ->where('metrics.messages', 7)
            ->where('metrics.projectViews', 8190));
});

test('guests cannot visit the print view', function () {
    $this->get(route('dashboard.print'))->assertRedirect(route('login'));
});

test('non-admin users cannot visit the print view', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('dashboard.print'))->assertForbidden();
});

test('the print view renders all dashboard views in export mode', function () {
    $this->actingAs(User::factory()->admin()->create());

    $this->get(route('dashboard.print'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dashboard')
            ->where('exportMode', true));
});
