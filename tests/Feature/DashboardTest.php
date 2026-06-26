<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('dashboard'));
});

test('guests cannot visit the print view', function () {
    $this->get(route('dashboard.print'))->assertRedirect(route('login'));
});

test('the print view renders all dashboard views in export mode', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard.print'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dashboard')
            ->where('exportMode', true));
});
