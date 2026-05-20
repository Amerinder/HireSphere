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
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ApplicationController extends Controller
{
    public function store(StoreApplicationRequest $request, Job $job, ApplicationRepository $applications): ApplicationResource
    {
        $file = $request->file('cv');
        $application = $applications->apply($request->user(), $job, $request->safe()->except('cv') + [
            'cv_original_name' => $file->getClientOriginalName(),
            'cv_path' => $file->store('application-cvs'),
            'cv_mime_type' => $file->getClientMimeType(),
            'cv_size' => $file->getSize(),
        ]);

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

    public function withdraw(Request $request, Application $application, ApplicationRepository $applications): ApplicationResource
    {
        abort_if((string) $application->student_id !== (string) $request->user()->getKey(), 403);

        return new ApplicationResource($applications->withdraw($application));
    }

    public function downloadCv(Request $request, Application $application): StreamedResponse
    {
        $user = $request->user();
        $job = Job::findOrFail($application->job_id);

        abort_if(
            ! $user || ((string) $application->student_id !== (string) $user->getKey() && ! $job->isOwnedBy($user) && $user->role !== User::ROLE_ADMIN),
            403
        );

        abort_if(! $application->cv_path || ! Storage::exists($application->cv_path), 404);

        return Storage::response($application->cv_path, $application->cv_original_name, [
            'Content-Disposition' => 'inline; filename="'.$application->cv_original_name.'"',
        ]);
    }

    private function authorizeRecruiterForJob(Request $request, Job $job): void
    {
        $user = $request->user();

        abort_if(! $user || (! $job->isOwnedBy($user) && $user->role !== User::ROLE_ADMIN), 403);
    }
}
