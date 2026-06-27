<?php

use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/print', [DashboardController::class, 'print'])->name('dashboard.print');

    Route::post('dashboard/projects', [ProjectController::class, 'store'])->name('admin.projects.store');
    Route::post('dashboard/projects/{project}', [ProjectController::class, 'update'])->name('admin.projects.update');
    Route::delete('dashboard/projects/{project}', [ProjectController::class, 'destroy'])->name('admin.projects.destroy');

    Route::patch('dashboard/testimonials/{testimonial}', [TestimonialController::class, 'update'])->name('admin.testimonials.update');
    Route::delete('dashboard/testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->name('admin.testimonials.destroy');
});

require __DIR__.'/settings.php';
