<?php

namespace Database\Factories;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->catchPhrase();

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 99999),
            'category' => fake()->randomElement(['E-Commerce', 'SaaS Dashboard', 'Fintech', 'Agency Site']),
            'year' => (string) fake()->numberBetween(2022, 2025),
            'description' => fake()->sentence(),
            'tags' => fake()->randomElements(['React', 'Next.js', 'Laravel', 'Vue', 'Node.js', 'PostgreSQL'], 3),
            'image_path' => null,
            'status' => ProjectStatus::Published,
            'views' => fake()->numberBetween(0, 5000),
            'sort_order' => 0,
        ];
    }

    /**
     * Indicate that the project is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ProjectStatus::Draft,
        ]);
    }
}
