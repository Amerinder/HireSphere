<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationStatusRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use App\Repositories\ApplicationRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApplicationController extends Controller
{
    public function store(StoreApplicationRequest $request, Job $job, ApplicationRepository $applications): ApplicationResource
    {
        $application = $applications->apply($request->user(), $job, $request->validated());

        return new ApplicationResource($application);
    }

    public function mine(Request $request, ApplicationRepository $applications): AnonymousResourceCollection
    {
        return ApplicationResource::collection($applications->forStudent($request->user()));
    }

    public function forJob(Request $request, Job $job, ApplicationRepository $applications): AnonymousResourceCollection
    {
        $this->authorizeRecruiterForJob($request, $job);

        return ApplicationResource::collection($applications->forJob($job));
    }

    public function updateStatus(UpdateApplicationStatusRequest $request, Application $application, ApplicationRepository $applications): ApplicationResource
    {
        $job = Job::findOrFail($application->job_id);
        $this->authorizeRecruiterForJob($request, $job);

        return new ApplicationResource($applications->updateStatus($application, $request->string('status')->toString()));
    }

    private function authorizeRecruiterForJob(Request $request, Job $job): void
    {
        $user = $request->user();

        abort_if(! $user || (! $job->isOwnedBy($user) && $user->role !== User::ROLE_ADMIN), 403);
    }
}
