<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobRequest;
use App\Http\Requests\UpdateJobRequest;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Models\User;
use App\Repositories\JobRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobController extends Controller
{
    public function index(Request $request, JobRepository $jobs): AnonymousResourceCollection
    {
        $perPage = min((int) $request->integer('per_page', 12), 50);

        if ($request->user()?->role === User::ROLE_RECRUITER && $request->boolean('mine')) {
            return JobResource::collection($jobs->paginateForRecruiter($request->user(), $perPage));
        }

        return JobResource::collection($jobs->paginateOpen($request->only([
            'q',
            'location',
            'workplace_type',
            'experience_level',
            'skill',
            'salary_min',
            'salary_max',
            'sort',
        ]), $perPage));
    }

    public function store(StoreJobRequest $request, JobRepository $jobs): JobResource
    {
        $job = $jobs->createForRecruiter($request->user(), $request->validated());

        return new JobResource($job);
    }

    public function show(Job $job): JobResource
    {
        return new JobResource($job);
    }

    public function update(UpdateJobRequest $request, Job $job, JobRepository $jobs): JobResource
    {
        $this->authorizeOwner($request, $job);

        return new JobResource($jobs->update($job, $request->validated()));
    }

    public function destroy(Request $request, Job $job): JsonResponse
    {
        $this->authorizeOwner($request, $job);

        $job->delete();

        return response()->json(['message' => 'Job deleted successfully.']);
    }

    private function authorizeOwner(Request $request, Job $job): void
    {
        $user = $request->user();

        abort_if(! $user || (! $job->isOwnedBy($user) && $user->role !== User::ROLE_ADMIN), 403);
    }
}
