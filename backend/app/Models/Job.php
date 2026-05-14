<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Job extends Model
{
    public const STATUS_DRAFT = 'draft';

    public const STATUS_OPEN = 'open';

    public const STATUS_CLOSED = 'closed';

    protected $connection = 'mongodb';

    protected $collection = 'jobs';

    protected $fillable = [
        'recruiter_id',
        'company_id',
        'company_name',
        'title',
        'description',
        'location',
        'workplace_type',
        'employment_type',
        'experience_level',
        'salary_min',
        'salary_max',
        'currency',
        'skills',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'salary_min' => 'integer',
            'salary_max' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function isOwnedBy(User $user): bool
    {
        return (string) $this->recruiter_id === (string) $user->getKey();
    }
}
