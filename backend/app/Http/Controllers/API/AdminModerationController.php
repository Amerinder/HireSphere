<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Models\Company;
use App\Models\Job;
use Illuminate\Http\JsonResponse;

class AdminModerationController extends Controller
{
    public function closeJob(Job $job): JobResource
    {
        $job->forceFill(['status' => Job::STATUS_CLOSED])->save();

        return new JobResource($job->refresh());
    }

    public function verifyRecruiter(string $recruiterId): JsonResponse
    {
        $company = Company::where('recruiter_id', $recruiterId)->firstOrFail();
        $company->forceFill(['verified_at' => now()])->save();

        return response()->json([
            'message' => 'Recruiter company verified.',
            'company_id' => (string) $company->getKey(),
        ]);
    }
}
