<?php

use Inertia\Testing\AssertableInertia;

test('the home page renders the portfolio landing page', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('welcome'));
});
