<?php

namespace App\Services;

use App\Models\LoginOtp;
use App\Models\User;
use App\Services\Email\ResendEmailService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginOtpService
{
    public function __construct(private readonly ResendEmailService $emailService)
    {
    }

    public function send(string $email, string $role, ?string $ipAddress, ?string $userAgent): array
    {
        $normalizedEmail = Str::lower($email);
        $code = (string) random_int(100000, 999999);
        $expiresAt = now()->addMinutes((int) config('auth.login_otps.expire_minutes', 10));

        LoginOtp::where('email', $normalizedEmail)
            ->whereNull('used_at')
            ->update(['used_at' => now()]);

        LoginOtp::create([
            'email' => $normalizedEmail,
            'code_hash' => hash('sha256', $code),
            'role' => $role,
            'expires_at' => $expiresAt,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        $this->emailService->sendLoginOtp($normalizedEmail, $code, $expiresAt);

        return [
            'expires_at' => $expiresAt,
            'local_otp' => app()->isLocal() && config('mail.default') === 'log' ? $code : null,
        ];
    }

    public function verify(string $email, string $code): User
    {
        $normalizedEmail = Str::lower($email);
        $loginOtp = LoginOtp::where('email', $normalizedEmail)
            ->where('code_hash', hash('sha256', $code))
            ->latest()
            ->first();

        if (! $loginOtp || ! $loginOtp->isUsable()) {
            throw ValidationException::withMessages([
                'code' => ['This OTP is invalid or expired.'],
            ]);
        }

        $loginOtp->markUsed();

        $user = User::firstOrCreate(
            ['email' => $normalizedEmail],
            [
                'name' => Str::of($normalizedEmail)->before('@')->replace(['.', '_', '-'], ' ')->title()->toString(),
                'role' => $loginOtp->role ?: User::ROLE_STUDENT,
                'email_verified_at' => now(),
            ],
        );

        if (! $user->email_verified_at) {
            $user->email_verified_at = now();
        }

        $user->last_login_at = now();
        $user->save();

        return $user;
    }

    public function logout(User $user): void
    {
        $token = $user->currentAccessToken();

        if (! $token) {
            throw new AuthenticationException();
        }

        $token->delete();
    }
}
