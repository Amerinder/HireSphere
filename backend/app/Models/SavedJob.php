<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class SavedJob extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'saved_jobs';

    protected $fillable = [
        'job_id',
        'student_id',
        'saved_at',
    ];

    protected function casts(): array
    {
        return [
            'saved_at' => 'datetime',
        ];
    }
}
