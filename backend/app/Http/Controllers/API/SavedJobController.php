<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Models\SavedJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    public function index(Request $request)
    {
        $savedJobIds = SavedJob::where('student_id', (string) $request->user()->getKey())
            ->pluck('job_id')
            ->all();

        return JobResource::collection(Job::whereIn('_id', $savedJobIds)->latest()->paginate(12));
    }

    public function store(Request $request, Job $job): JsonResponse
    {
        SavedJob::firstOrCreate([
            'student_id' => (string) $request->user()->getKey(),
            'job_id' => (string) $job->getKey(),
        ], [
            'saved_at' => now(),
        ]);

        return response()->json(['message' => 'Job saved.'], 201);
    }

    public function destroy(Request $request, Job $job): JsonResponse
    {
        SavedJob::where('student_id', (string) $request->user()->getKey())
            ->where('job_id', (string) $job->getKey())
            ->delete();

        return response()->json(['message' => 'Job removed from saved jobs.']);
    }
}
