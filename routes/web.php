<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/print', [DashboardController::class, 'print'])->name('dashboard.print');
});

require __DIR__.'/settings.php';
