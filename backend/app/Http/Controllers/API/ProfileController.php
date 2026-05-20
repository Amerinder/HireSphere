<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function update(UpdateProfileRequest $request): UserResource
    {
        $user = $request->user();
        $data = $request->safe()->except('company');

        $user->fill($data)->save();

        if ($user->role === User::ROLE_RECRUITER && $request->validated('company')) {
            Company::updateOrCreate(
                ['recruiter_id' => (string) $user->getKey()],
                $request->validated('company') + ['recruiter_id' => (string) $user->getKey()],
            );
        }

        return new UserResource($user->refresh());
    }
}
