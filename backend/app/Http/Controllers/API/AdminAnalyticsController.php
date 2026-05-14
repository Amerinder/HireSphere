<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\SavedJob;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminAnalyticsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'totals' => [
                'users' => User::count(),
                'students' => User::where('role', User::ROLE_STUDENT)->count(),
                'recruiters' => User::where('role', User::ROLE_RECRUITER)->count(),
                'admins' => User::where('role', User::ROLE_ADMIN)->count(),
                'jobs' => Job::count(),
                'open_jobs' => Job::where('status', Job::STATUS_OPEN)->count(),
                'applications' => Application::count(),
                'saved_jobs' => SavedJob::count(),
            ],
            'applications_by_status' => [
                'submitted' => Application::where('status', Application::STATUS_SUBMITTED)->count(),
                'shortlisted' => Application::where('status', Application::STATUS_SHORTLISTED)->count(),
                'rejected' => Application::where('status', Application::STATUS_REJECTED)->count(),
            ],
            'recent' => [
                'users' => User::latest()->limit(5)->get()->map(fn (User $user) => [
                    'id' => (string) $user->getKey(),
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at?->toIso8601String(),
                ]),
                'jobs' => Job::latest()->limit(5)->get()->map(fn (Job $job) => [
                    'id' => (string) $job->getKey(),
                    'title' => $job->title,
                    'company_name' => $job->company_name,
                    'status' => $job->status,
                    'created_at' => $job->created_at?->toIso8601String(),
                ]),
            ],
        ]);
    }
}
