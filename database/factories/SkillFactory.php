<?php

namespace Database\Factories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Skill>
 */
class SkillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'category' => fake()->randomElement(['Frontend', 'Backend', 'Database & Tools']),
            'in_ticker' => false,
            'sort_order' => 0,
        ];
    }

    /**
     * Indicate that the skill appears in the marquee ticker.
     */
    public function inTicker(): static
    {
        return $this->state(fn (array $attributes) => [
            'in_ticker' => true,
        ]);
    }
}
