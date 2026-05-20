<?php

namespace App\Services\Email;

use Illuminate\Support\Facades\Mail;

class ResendEmailService
{
    public function sendLoginOtp(string $email, string $code, mixed $expiresAt): void
    {
        Mail::html(view('emails.login-otp', [
            'code' => $code,
            'expiresAt' => $expiresAt?->format('M j, Y g:i A T'),
        ])->render(), function ($message) use ($email) {
            $message->to($email)
                ->subject('Your HireSphere login OTP');
        });
    }
}
