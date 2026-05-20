<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendLoginOtpRequest;
use App\Http\Requests\VerifyLoginOtpRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\LoginOtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function sendOtp(SendLoginOtpRequest $request, LoginOtpService $loginOtps): JsonResponse
    {
        $result = $loginOtps->send(
            email: $request->string('email')->toString(),
            role: $request->string('role', User::ROLE_STUDENT)->toString(),
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return response()->json([
            'message' => 'Check Email for the OTP.',
            'expires_at' => $result['expires_at']->toIso8601String(),
            'local_otp' => $result['local_otp'],
        ], 202);
    }

    public function verifyOtp(VerifyLoginOtpRequest $request, LoginOtpService $loginOtps): JsonResponse
    {
        $user = $loginOtps->verify(
            email: $request->string('email')->toString(),
            code: $request->string('code')->toString(),
        );

        $token = $user->createToken(
            name: 'email-otp',
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

    public function logout(Request $request, LoginOtpService $loginOtps): JsonResponse
    {
        $loginOtps->logout($request->user());

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
