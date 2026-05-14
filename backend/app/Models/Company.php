<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Company extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'companies';

    protected $fillable = [
        'recruiter_id',
        'name',
        'website',
        'industry',
        'size',
        'location',
        'description',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }
}
