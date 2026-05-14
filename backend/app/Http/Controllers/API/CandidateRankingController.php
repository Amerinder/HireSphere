<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CandidateRankingController extends Controller
{
    public function __invoke(Request $request, Job $job): AnonymousResourceCollection
    {
        $user = $request->user();

        abort_if(! $user || (! $job->isOwnedBy($user) && $user->role !== User::ROLE_ADMIN), 403);

        return ApplicationResource::collection(
            Application::where('job_id', (string) $job->getKey())
                ->orderByDesc('ai_match_score')
                ->paginate(25)
        );
    }
}
