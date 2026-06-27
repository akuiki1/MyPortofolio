<?php

namespace Database\Factories;

use App\Enums\TestimonialStatus;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author_name' => fake()->name(),
            'author_role' => fake()->jobTitle().', '.fake()->company(),
            'quote' => fake()->paragraph(),
            'avatar_path' => null,
            'status' => TestimonialStatus::Approved,
            'sort_order' => 0,
        ];
    }

    /**
     * Indicate that the testimonial is pending approval.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TestimonialStatus::Pending,
        ]);
    }
}
