<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Application extends Model
{
    public const STATUS_SUBMITTED = 'submitted';

    public const STATUS_SHORTLISTED = 'shortlisted';

    public const STATUS_REJECTED = 'rejected';

    protected $connection = 'mongodb';

    protected $collection = 'applications';

    protected $fillable = [
        'job_id',
        'student_id',
        'recruiter_id',
        'cover_note',
        'resume_id',
        'status',
        'ai_match_score',
        'applied_at',
        'shortlisted_at',
        'rejected_at',
    ];

    protected function casts(): array
    {
        return [
            'ai_match_score' => 'integer',
            'applied_at' => 'datetime',
            'shortlisted_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }
}
