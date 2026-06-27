<?php

use App\Enums\TestimonialStatus;
use App\Models\Testimonial;
use App\Models\User;

test('non-admin users cannot approve testimonials', function () {
    $testimonial = Testimonial::factory()->pending()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.testimonials.update', $testimonial), ['status' => 'approved'])
        ->assertForbidden();

    expect($testimonial->refresh()->status)->toBe(TestimonialStatus::Pending);
});

test('an admin can approve a pending testimonial', function () {
    $testimonial = Testimonial::factory()->pending()->create();

    $this->actingAs(User::factory()->admin()->create())
        ->from(route('dashboard'))
        ->patch(route('admin.testimonials.update', $testimonial), ['status' => 'approved'])
        ->assertRedirect(route('dashboard'));

    expect($testimonial->refresh()->status)->toBe(TestimonialStatus::Approved);
});

test('approving requires a valid status', function () {
    $testimonial = Testimonial::factory()->pending()->create();

    $this->actingAs(User::factory()->admin()->create())
        ->patch(route('admin.testimonials.update', $testimonial), ['status' => 'banana'])
        ->assertSessionHasErrors('status');
});

test('an admin can delete a testimonial', function () {
    $testimonial = Testimonial::factory()->create();

    $this->actingAs(User::factory()->admin()->create())
        ->delete(route('admin.testimonials.destroy', $testimonial))
        ->assertRedirect();

    expect(Testimonial::find($testimonial->id))->toBeNull();
});
