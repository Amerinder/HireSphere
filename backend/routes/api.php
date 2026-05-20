<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminAnalyticsController;
use App\Http\Controllers\API\AdminModerationController;
use App\Http\Controllers\API\AdminUserController;
use App\Http\Controllers\API\ApplicationController;
use App\Http\Controllers\API\CandidateRankingController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\HealthController;
use App\Http\Controllers\API\JobController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\ResumeController;
use App\Http\Controllers\API\SavedJobController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', HealthController::class)->name('api.health');

    Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
    Route::get('/jobs/{job}', [JobController::class, 'show'])->name('jobs.show');

    Route::prefix('auth')->group(function () {
        Route::post('/otp', [AuthController::class, 'sendOtp'])
            ->middleware('throttle:login-otps')
            ->name('auth.otp.send');

        Route::post('/otp/verify', [AuthController::class, 'verifyOtp'])
            ->middleware('throttle:login-otps')
            ->name('auth.otp.verify');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
            Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        });
    });

    Route::middleware(['auth:sanctum', 'role:student,recruiter,admin'])->get('/dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

        Route::middleware('role:recruiter,admin')->group(function () {
            Route::get('/recruiter/jobs', [JobController::class, 'index'])->name('recruiter.jobs.index');
            Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');
            Route::put('/jobs/{job}', [JobController::class, 'update'])->name('jobs.update');
            Route::delete('/jobs/{job}', [JobController::class, 'destroy'])->name('jobs.destroy');
            Route::get('/jobs/{job}/applications', [ApplicationController::class, 'forJob'])->name('jobs.applications.index');
            Route::get('/jobs/{job}/candidate-ranking', CandidateRankingController::class)->name('jobs.candidate-ranking');
            Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus'])->name('applications.status.update');
        });

        Route::middleware('role:student')->group(function () {
            Route::post('/jobs/{job}/applications', [ApplicationController::class, 'store'])->name('applications.store');
            Route::get('/applications/me', [ApplicationController::class, 'mine'])->name('applications.mine');
            Route::delete('/applications/{application}', [ApplicationController::class, 'withdraw'])->name('applications.withdraw');
            Route::get('/resumes', [ResumeController::class, 'index'])->name('resumes.index');
            Route::post('/resumes', [ResumeController::class, 'store'])->name('resumes.store');
            Route::get('/resumes/{resume}', [ResumeController::class, 'show'])->name('resumes.show');
            Route::post('/resumes/{resume}/analyze', [ResumeController::class, 'analyze'])->name('resumes.analyze');
            Route::get('/saved-jobs', [SavedJobController::class, 'index'])->name('saved-jobs.index');
            Route::post('/jobs/{job}/save', [SavedJobController::class, 'store'])->name('saved-jobs.store');
            Route::delete('/jobs/{job}/save', [SavedJobController::class, 'destroy'])->name('saved-jobs.destroy');
        });

        Route::middleware('role:student,recruiter,admin')->group(function () {
            Route::get('/applications/{application}/cv', [ApplicationController::class, 'downloadCv'])->name('applications.cv.download');
        });

        Route::prefix('admin')->middleware('role:admin')->group(function () {
            Route::get('/analytics', AdminAnalyticsController::class)->name('admin.analytics');
            Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
            Route::patch('/users/{user}/make-admin', [AdminUserController::class, 'makeAdmin'])->name('admin.users.make-admin');
            Route::patch('/jobs/{job}/close', [AdminModerationController::class, 'closeJob'])->name('admin.jobs.close');
            Route::patch('/recruiters/{recruiterId}/verify', [AdminModerationController::class, 'verifyRecruiter'])->name('admin.recruiters.verify');
        });
    });
});
