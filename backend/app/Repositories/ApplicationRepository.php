<?php

namespace App\Repositories;

use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class ApplicationRepository
{
    public function apply(User $student, Job $job, array $data): Application
    {
        if ($job->status !== Job::STATUS_OPEN) {
            throw ValidationException::withMessages([
                'job' => ['This job is not accepting applications.'],
            ]);
        }

        $existing = Application::where('job_id', (string) $job->getKey())
            ->where('student_id', (string) $student->getKey())
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'job' => ['You have already applied to this job.'],
            ]);
        }

        return Application::create([
            'job_id' => (string) $job->getKey(),
            'student_id' => (string) $student->getKey(),
            'recruiter_id' => (string) $job->recruiter_id,
            'cover_note' => $data['cover_note'] ?? null,
            'resume_id' => $data['resume_id'] ?? null,
            'status' => Application::STATUS_SUBMITTED,
            'applied_at' => now(),
        ]);
    }

    public function forStudent(User $student, int $perPage = 12): LengthAwarePaginator
    {
        return Application::query()
            ->where('student_id', (string) $student->getKey())
            ->latest()
            ->paginate($perPage);
    }

    public function forJob(Job $job, int $perPage = 12): LengthAwarePaginator
    {
        return Application::query()
            ->where('job_id', (string) $job->getKey())
            ->latest()
            ->paginate($perPage);
    }

    public function updateStatus(Application $application, string $status): Application
    {
        $application->status = $status;
        $application->shortlisted_at = $status === Application::STATUS_SHORTLISTED ? now() : null;
        $application->rejected_at = $status === Application::STATUS_REJECTED ? now() : null;
        $application->save();

        return $application->refresh();
    }
}
