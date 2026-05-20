<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class LoginOtp extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'login_otps';

    protected $fillable = [
        'email',
        'code_hash',
        'role',
        'expires_at',
        'used_at',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
        ];
    }

    public function markUsed(): void
    {
        $this->forceFill(['used_at' => now()])->save();
    }

    public function isUsable(): bool
    {
        return $this->used_at === null && $this->expires_at?->isFuture();
    }
}
