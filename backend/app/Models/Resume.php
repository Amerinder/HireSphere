<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Resume extends Model
{
    public const STATUS_UPLOADED = 'uploaded';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_ANALYZED = 'analyzed';

    public const STATUS_FAILED = 'failed';

    protected $connection = 'mongodb';

    protected $collection = 'resumes';

    protected $fillable = [
        'student_id',
        'original_name',
        'path',
        'mime_type',
        'size',
        'text',
        'status',
        'analysis',
        'analyzed_at',
        'failure_reason',
    ];

    protected function casts(): array
    {
        return [
            'analysis' => 'array',
            'size' => 'integer',
            'analyzed_at' => 'datetime',
        ];
    }
}
