<?php

namespace Database\Factories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'role' => 'Full-Stack Developer',
            'tagline' => fake()->sentence(),
            'bio' => fake()->paragraph(),
            'location' => 'Indonesia · Remote',
            'experience' => '5+ years',
            'focus' => 'Web apps & sites',
            'availability_status' => 'Available',
            'email' => fake()->safeEmail(),
            'avatar_path' => null,
            'stats' => [
                ['value' => 5, 'suffix' => '+', 'label' => 'Years building'],
                ['value' => 40, 'suffix' => '+', 'label' => 'Projects shipped'],
            ],
        ];
    }
}
