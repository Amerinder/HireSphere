<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\SavedJob;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === User::ROLE_STUDENT) {
            return response()->json([
                'applications_count' => Application::where('student_id', (string) $user->getKey())->count(),
                'saved_jobs_count' => SavedJob::where('student_id', (string) $user->getKey())->count(),
                'shortlisted_count' => Application::where('student_id', (string) $user->getKey())->where('status', Application::STATUS_SHORTLISTED)->count(),
            ]);
        }

        if ($user->role === User::ROLE_RECRUITER) {
            $jobIds = Job::where('recruiter_id', (string) $user->getKey())->pluck('_id')->map(fn ($id) => (string) $id)->all();

            return response()->json([
                'jobs_count' => count($jobIds),
                'open_jobs_count' => Job::where('recruiter_id', (string) $user->getKey())->where('status', Job::STATUS_OPEN)->where(function ($builder) {
                    $builder->whereNull('application_deadline')->orWhere('application_deadline', '>=', now()->startOfDay());
                })->count(),
                'closed_jobs_count' => Job::where('recruiter_id', (string) $user->getKey())->where(function ($builder) {
                    $builder->where('status', Job::STATUS_CLOSED)->orWhere('application_deadline', '<', now()->startOfDay());
                })->count(),
                'applications_received' => Application::whereIn('job_id', $jobIds)->count(),
                'shortlisted_count' => Application::whereIn('job_id', $jobIds)->where('status', Application::STATUS_SHORTLISTED)->count(),
            ]);
        }

        return response()->json([
            'users_count' => User::count(),
            'active_recruiters' => User::where('role', User::ROLE_RECRUITER)->count(),
            'jobs_count' => Job::count(),
            'applications_count' => Application::count(),
        ]);
    }
}
