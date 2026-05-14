<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminUserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = User::query()->latest();

        if ($request->filled('role')) {
            $query->where('role', $request->string('role')->toString());
        }

        return UserResource::collection($query->paginate(min($request->integer('per_page', 20), 50)));
    }

    public function makeAdmin(User $user): UserResource
    {
        $user->forceFill(['role' => User::ROLE_ADMIN])->save();

        return new UserResource($user->refresh());
    }
}
