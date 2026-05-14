<?php

namespace App\Services\Email;

use Illuminate\Support\Facades\Log;
use Resend\Resend;

class ResendEmailService
{
    public function sendMagicLink(string $email, string $magicLinkUrl): void
    {
        $apiKey = config('services.resend.key');

        if (blank($apiKey)) {
            Log::info('Magic link generated', [
                'email' => $email,
                'url' => $magicLinkUrl,
            ]);

            return;
        }

        Resend::client($apiKey)->emails->send([
            'from' => config('mail.from.address'),
            'to' => [$email],
            'subject' => 'Your HireSphere login link',
            'html' => view('emails.magic-link', [
                'magicLinkUrl' => $magicLinkUrl,
            ])->render(),
        ]);
    }
}
