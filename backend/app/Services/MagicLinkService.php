<?php

namespace App\Services;

use App\Models\MagicLink;
use App\Models\User;
use App\Services\Email\ResendEmailService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MagicLinkService
{
    public function __construct(private readonly ResendEmailService $emailService)
    {
    }

    public function send(string $email, string $role, ?string $ipAddress, ?string $userAgent): array
    {
        $normalizedEmail = Str::lower($email);
        $token = Str::random(64);
        $expiresAt = now()->addMinutes((int) config('auth.magic_links.expire_minutes', 15));

        MagicLink::where('email', $normalizedEmail)
            ->whereNull('used_at')
            ->update(['used_at' => now()]);

        MagicLink::create([
            'email' => $normalizedEmail,
            'token_hash' => hash('sha256', $token),
            'role' => $role,
            'expires_at' => $expiresAt,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        $magicLinkUrl = $this->buildFrontendLink($normalizedEmail, $token);
        $this->emailService->sendMagicLink($normalizedEmail, $magicLinkUrl);

        return [
            'expires_at' => $expiresAt,
            'magic_link_url' => app()->isLocal() ? $magicLinkUrl : null,
        ];
    }

    public function verify(string $email, string $token): User
    {
        $normalizedEmail = Str::lower($email);
        $magicLink = MagicLink::where('email', $normalizedEmail)
            ->where('token_hash', hash('sha256', $token))
            ->latest()
            ->first();

        if (! $magicLink || ! $magicLink->isUsable()) {
            throw ValidationException::withMessages([
                'token' => ['This magic link is invalid or expired.'],
            ]);
        }

        $magicLink->markUsed();

        $user = User::firstOrCreate(
            ['email' => $normalizedEmail],
            [
                'name' => Str::of($normalizedEmail)->before('@')->replace(['.', '_', '-'], ' ')->title()->toString(),
                'role' => $magicLink->role ?: User::ROLE_STUDENT,
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

    private function buildFrontendLink(string $email, string $token): string
    {
        return rtrim((string) config('app.frontend_url'), '/').'/auth/verify?'.http_build_query([
            'email' => $email,
            'token' => $token,
        ]);
    }
}
