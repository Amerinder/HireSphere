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
        'application_deadline',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'salary_min' => 'integer',
            'salary_max' => 'integer',
            'application_deadline' => 'date',
            'published_at' => 'datetime',
        ];
    }

    public function isOwnedBy(User $user): bool
    {
        return (string) $this->recruiter_id === (string) $user->getKey();
    }

    public function isExpired(): bool
    {
        return $this->application_deadline !== null && $this->application_deadline->lt(now()->startOfDay());
    }

    public function isAcceptingApplications(): bool
    {
        return $this->status === self::STATUS_OPEN && ! $this->isExpired();
    }
}
