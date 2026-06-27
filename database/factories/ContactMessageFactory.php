<?php

namespace Database\Factories;

use App\Enums\MessageStatus;
use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMessage>
 */
class ContactMessageFactory extends Factory
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
            'email' => fake()->safeEmail(),
            'subject' => fake()->sentence(3),
            'body' => fake()->paragraph(),
            'budget' => fake()->randomElement(['$5k', '$8–12k', '$15k+', 'Hourly']),
            'timeline' => fake()->randomElement(['2 weeks', '6 weeks', 'Q3', 'ASAP']),
            'status' => MessageStatus::New,
            'starred' => false,
        ];
    }
}
