<?php

namespace Database\Seeders;

use App\Enums\MessageStatus;
use App\Enums\ProjectStatus;
use App\Enums\TestimonialStatus;
use App\Models\ContactMessage;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\SocialLink;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PortfolioSeeder extends Seeder
{
    /**
     * Seed the portfolio content currently hardcoded in the React pages.
     *
     * Idempotent: re-running updates existing rows by their natural key and
     * never wipes real contact messages.
     */
    public function run(): void
    {
        $this->seedProfile();
        $this->seedSocialLinks();
        $this->seedProjects();
        $this->seedSkills();
        $this->seedServices();
        $this->seedTestimonials();
        $this->seedMessages();
    }

    private function seedProfile(): void
    {
        Profile::query()->updateOrCreate(['id' => 1], [
            'name' => 'Rizki Syandana',
            'role' => 'Full-Stack Developer',
            'tagline' => 'I build fast, modern web experiences from idea to production.',
            'bio' => 'Full-stack developer focused on shipping polished, performant web apps and sites.',
            'location' => 'Indonesia · Remote',
            'experience' => '5+ years',
            'focus' => 'Web apps & sites',
            'availability_status' => 'Available',
            'email' => 'hello@rizki.dev',
            'stats' => [
                ['value' => 5, 'suffix' => '+', 'label' => 'Years building'],
                ['value' => 40, 'suffix' => '+', 'label' => 'Projects shipped'],
                ['value' => 32, 'suffix' => '+', 'label' => 'Happy clients'],
                ['value' => 99, 'suffix' => '%', 'label' => 'On-time delivery'],
            ],
        ]);
    }

    private function seedSocialLinks(): void
    {
        $links = [
            ['label' => 'GitHub', 'handle' => 'github.com/rizkisyandana', 'url' => '#'],
            ['label' => 'LinkedIn', 'handle' => 'in/rizkisyandana', 'url' => '#'],
            ['label' => 'Instagram', 'handle' => '@rizki.dev', 'url' => '#'],
            ['label' => 'Email', 'handle' => 'hello@rizki.dev', 'url' => 'mailto:hello@rizki.dev'],
        ];

        foreach ($links as $i => $link) {
            SocialLink::query()->updateOrCreate(
                ['label' => $link['label']],
                [...$link, 'sort_order' => $i],
            );
        }
    }

    private function seedProjects(): void
    {
        $projects = [
            ['title' => 'Nexus Commerce', 'category' => 'E-Commerce', 'year' => '2025', 'description' => 'Headless storefront with sub-second loads and a custom checkout flow.', 'tags' => ['Next.js', 'Stripe', 'PostgreSQL'], 'status' => ProjectStatus::Published, 'views' => 2140],
            ['title' => 'Lumina Analytics', 'category' => 'SaaS Dashboard', 'year' => '2025', 'description' => 'Real-time analytics dashboard handling millions of events a day.', 'tags' => ['React', 'Node.js', 'WebSocket'], 'status' => ProjectStatus::Published, 'views' => 1870],
            ['title' => 'Wander', 'category' => 'Travel Booking', 'year' => '2024', 'description' => 'End-to-end booking experience with live maps and availability.', 'tags' => ['Vue', 'Laravel', 'MySQL'], 'status' => ProjectStatus::Published, 'views' => 1500],
            ['title' => 'Pulse Fitness', 'category' => 'Health & Fitness', 'year' => '2024', 'description' => 'Mobile-first PWA with offline workouts and progress tracking.', 'tags' => ['React', 'PWA', 'IndexedDB'], 'status' => ProjectStatus::Published, 'views' => 1180],
            ['title' => 'Orbit Studio', 'category' => 'Agency Site', 'year' => '2023', 'description' => 'Award-style marketing site with rich, performant motion design.', 'tags' => ['Astro', 'GSAP', 'WebGL'], 'status' => ProjectStatus::Published, 'views' => 1500],
            ['title' => 'Verde Finance', 'category' => 'Fintech', 'year' => '2023', 'description' => 'Personal finance app with secure bank integrations and budgets.', 'tags' => ['Next.js', 'Plaid', 'Prisma'], 'status' => ProjectStatus::Draft, 'views' => 0],
        ];

        foreach ($projects as $i => $project) {
            Project::query()->updateOrCreate(
                ['slug' => Str::slug($project['title'])],
                [...$project, 'slug' => Str::slug($project['title']), 'sort_order' => $i],
            );
        }
    }

    private function seedSkills(): void
    {
        $groups = [
            'Frontend' => ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Tailwind CSS'],
            'Backend' => ['Node.js', 'Express', 'PHP', 'Laravel', 'REST APIs', 'GraphQL'],
            'Database & Tools' => ['PostgreSQL', 'MySQL', 'MongoDB', 'Git', 'Docker', 'Figma', 'Vercel'],
        ];

        $ticker = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Laravel', 'PostgreSQL', 'GraphQL', 'Docker', 'Vue', 'Express', 'Figma'];

        $sort = 0;

        foreach ($groups as $category => $items) {
            foreach ($items as $name) {
                Skill::query()->updateOrCreate(
                    ['name' => $name],
                    [
                        'category' => $category,
                        'in_ticker' => in_array($name, $ticker, true),
                        'sort_order' => $sort++,
                    ],
                );
            }
        }
    }

    private function seedServices(): void
    {
        $services = [
            ['title' => 'Web Development', 'description' => 'Complete websites and web apps built from scratch — responsive, fast, and ready to scale.', 'points' => ['Landing & marketing sites', 'Web applications', 'CMS integration']],
            ['title' => 'Frontend Engineering', 'description' => 'Pixel-perfect interfaces with smooth interactions and rock-solid accessibility.', 'points' => ['Design-to-code', 'Component systems', 'Micro-interactions']],
            ['title' => 'Backend & APIs', 'description' => 'Reliable server-side logic, databases, and APIs that quietly power your product.', 'points' => ['REST & GraphQL APIs', 'Database design', 'Auth & integrations']],
            ['title' => 'Performance & SEO', 'description' => 'Audits and optimization to make your site lightning fast and easy to find.', 'points' => ['Core Web Vitals', 'SEO foundations', 'Speed tuning']],
        ];

        foreach ($services as $i => $service) {
            Service::query()->updateOrCreate(
                ['title' => $service['title']],
                [...$service, 'sort_order' => $i],
            );
        }
    }

    private function seedTestimonials(): void
    {
        $testimonials = [
            ['author_name' => 'Sarah Lin', 'author_role' => 'Founder, Brightwave', 'quote' => 'Rizki turned our outdated site into a fast, modern platform. Conversions jumped 40% within two months.'],
            ['author_name' => 'Andre Pratama', 'author_role' => 'CTO, Lumina', 'quote' => 'Clean code, clear communication, and delivered ahead of schedule. Exactly the developer you hope to find.'],
            ['author_name' => 'Maria Gomez', 'author_role' => 'PM, Verde Finance', 'quote' => 'He understood our product better than we did. The new dashboard is genuinely a joy to use.'],
        ];

        foreach ($testimonials as $i => $testimonial) {
            Testimonial::query()->updateOrCreate(
                ['author_name' => $testimonial['author_name']],
                [...$testimonial, 'status' => TestimonialStatus::Approved, 'sort_order' => $i],
            );
        }
    }

    private function seedMessages(): void
    {
        $messages = [
            ['name' => 'Sarah Lin', 'email' => 'sarah@brightwave.co', 'subject' => 'Marketing redesign', 'budget' => '$8–12k', 'timeline' => '6 weeks', 'status' => MessageStatus::New, 'starred' => true, 'body' => "Hi Rizki — I'm the founder of Brightwave. We're a B2B SaaS company and our current marketing site is starting to hold us back. After seeing the Orbit Studio project in your portfolio, I knew I had to reach out.\n\nWe'd love a full redesign with a focus on conversion and speed. Do you have availability to start within the next month? Happy to share our brand guidelines and current analytics."],
            ['name' => 'Andre Pratama', 'email' => 'andre@lumina.io', 'subject' => 'Performance audit', 'budget' => '$5k', 'timeline' => '2 weeks', 'status' => MessageStatus::New, 'starred' => false, 'body' => "Hey Rizki, we met briefly at the React meetup. Our analytics dashboard (the one you actually built the first version of!) has grown a lot and is now noticeably sluggish with large datasets.\n\nWould you be open to a focused performance audit — profiling, identifying bottlenecks, and implementing the top fixes? Two-week engagement ideally."],
            ['name' => 'Maria Gomez', 'email' => 'maria@verde.finance', 'subject' => 'Verde phase 2', 'budget' => '$15k+', 'timeline' => 'Q3', 'status' => MessageStatus::Replied, 'starred' => true, 'body' => "Hi Rizki! Phase 1 has been performing beautifully — the team is thrilled and our users keep complimenting the new dashboard. We're ready to move on phase 2 whenever your calendar allows.\n\nScope is roughly: budgeting tools, a savings-goals module, and a couple of new bank integrations. Let's set up a kickoff call this week?"],
            ['name' => 'Tom Becker', 'email' => 'tom@orbit.studio', 'subject' => 'Launch animation', 'budget' => '$4k', 'timeline' => '10 days', 'status' => MessageStatus::Open, 'starred' => false, 'body' => "Rizki — big fan of your motion work. We have a product launch in just under two weeks and need a standout WebGL hero animation for the landing page. I know the timeline is tight.\n\nIs this something you could squeeze in? We have the creative direction locked, just need the engineering muscle to bring it to life smoothly across devices."],
            ['name' => 'Priya Nair', 'email' => 'priya@pulsefit.app', 'subject' => 'PWA bugfix', 'budget' => 'Hourly', 'timeline' => 'ASAP', 'status' => MessageStatus::Open, 'starred' => false, 'body' => "Hi Rizki, the Pulse Fitness PWA you built has been rock solid, but we've started getting reports of a sync bug in offline mode on iOS — workouts logged offline occasionally don't reconcile when the device comes back online.\n\nI've attached detailed repro steps and a few user reports. Could you take a look this week on an hourly basis? It's becoming a support headache."],
            ['name' => 'David Kim', 'email' => 'david@nexus.shop', 'subject' => 'Checkout v2', 'budget' => '$9k', 'timeline' => '5 weeks', 'status' => MessageStatus::Replied, 'starred' => false, 'body' => "Hi Rizki, Nexus Commerce has grown a lot since launch and we're ready to rebuild the checkout. We want a faster, single-page flow with Apple Pay and Google Pay support, plus better address validation.\n\nCould you put together a quote and rough timeline? Five weeks would be ideal but we have some flexibility for the right outcome."],
            ['name' => 'Lena Vogt', 'email' => 'lena@wander.travel', 'subject' => 'Booking calendar', 'budget' => '$6k', 'timeline' => '4 weeks', 'status' => MessageStatus::Open, 'starred' => true, 'body' => "Hi Rizki — Wander has been doing great and we want to level up the booking experience with a live availability calendar so travelers can see real-time openings before they commit.\n\nIt would need to sync with our existing inventory API. Is a four-week build realistic? Would love your thoughts on the approach."],
        ];

        foreach ($messages as $message) {
            ContactMessage::query()->updateOrCreate(
                ['email' => $message['email'], 'subject' => $message['subject']],
                $message,
            );
        }
    }
}
