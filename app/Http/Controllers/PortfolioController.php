<?php

namespace App\Http\Controllers;

use App\Enums\ProjectStatus;
use App\Enums\TestimonialStatus;
use App\Http\Resources\ProfileResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\SkillResource;
use App\Http\Resources\SocialLinkResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\SocialLink;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Render the public portfolio landing page from database content.
     */
    public function index(): Response
    {
        $profile = Profile::query()->first();

        return Inertia::render('welcome', [
            'profile' => $profile ? (new ProfileResource($profile))->resolve() : null,
            'projects' => ProjectResource::collection(
                Project::query()
                    ->where('status', ProjectStatus::Published)
                    ->orderBy('sort_order')
                    ->get()
            )->resolve(),
            'skills' => SkillResource::collection(
                Skill::query()->orderBy('sort_order')->get()
            )->resolve(),
            'services' => ServiceResource::collection(
                Service::query()->orderBy('sort_order')->get()
            )->resolve(),
            'testimonials' => TestimonialResource::collection(
                Testimonial::query()
                    ->where('status', TestimonialStatus::Approved)
                    ->orderBy('sort_order')
                    ->get()
            )->resolve(),
            'socials' => SocialLinkResource::collection(
                SocialLink::query()->orderBy('sort_order')->get()
            )->resolve(),
        ]);
    }
}
