<?php

namespace Database\Factories;

use App\Models\SocialLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SocialLink>
 */
class SocialLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => fake()->randomElement(['GitHub', 'LinkedIn', 'Instagram', 'Email']),
            'handle' => fake()->userName(),
            'url' => fake()->url(),
            'sort_order' => 0,
        ];
    }
}
