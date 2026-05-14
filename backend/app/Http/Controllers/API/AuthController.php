<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMagicLinkRequest;
use App\Http\Requests\VerifyMagicLinkRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\MagicLinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function sendMagicLink(SendMagicLinkRequest $request, MagicLinkService $magicLinks): JsonResponse
    {
        $result = $magicLinks->send(
            email: $request->string('email')->toString(),
            role: $request->string('role', User::ROLE_STUDENT)->toString(),
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return response()->json([
            'message' => 'If this email can sign in, a magic link has been sent.',
            'expires_at' => $result['expires_at']->toIso8601String(),
            'magic_link_url' => $result['magic_link_url'],
        ], 202);
    }

    public function verify(VerifyMagicLinkRequest $request, MagicLinkService $magicLinks): JsonResponse
    {
        $user = $magicLinks->verify(
            email: $request->string('email')->toString(),
            token: $request->string('token')->toString(),
        );

        $token = $user->createToken(
            name: 'magic-link',
            abilities: [$user->role],
            expiresAt: now()->addDays((int) env('SANCTUM_EXPIRATION_DAYS', 30)),
        );

        return response()->json([
            'token' => $token->plainTextToken,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
        ]);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request, MagicLinkService $magicLinks): JsonResponse
    {
        $magicLinks->logout($request->user());

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
