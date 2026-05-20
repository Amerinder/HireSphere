<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Application extends Model
{
    public const STATUS_SUBMITTED = 'submitted';

    public const STATUS_SHORTLISTED = 'shortlisted';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_WITHDRAWN = 'withdrawn';

    protected $connection = 'mongodb';

    protected $collection = 'applications';

    protected $fillable = [
        'job_id',
        'student_id',
        'recruiter_id',
        'first_name',
        'last_name',
        'college_name',
        'current_cgpa',
        'degree',
        'specialization',
        'cover_note',
        'resume_id',
        'cv_original_name',
        'cv_path',
        'cv_mime_type',
        'cv_size',
        'status',
        'ai_match_score',
        'applied_at',
        'shortlisted_at',
        'rejected_at',
        'withdrawn_at',
    ];

    protected function casts(): array
    {
        return [
            'ai_match_score' => 'integer',
            'current_cgpa' => 'float',
            'cv_size' => 'integer',
            'applied_at' => 'datetime',
            'shortlisted_at' => 'datetime',
            'rejected_at' => 'datetime',
            'withdrawn_at' => 'datetime',
        ];
    }
}
