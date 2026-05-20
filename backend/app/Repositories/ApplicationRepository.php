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
        if (! $job->isAcceptingApplications()) {
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
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'college_name' => $data['college_name'],
            'current_cgpa' => $data['current_cgpa'],
            'degree' => $data['degree'],
            'specialization' => $data['specialization'],
            'cover_note' => $data['cover_note'] ?? null,
            'resume_id' => $data['resume_id'] ?? null,
            'cv_original_name' => $data['cv_original_name'],
            'cv_path' => $data['cv_path'],
            'cv_mime_type' => $data['cv_mime_type'],
            'cv_size' => $data['cv_size'],
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
        if ($application->status === Application::STATUS_WITHDRAWN) {
            throw ValidationException::withMessages([
                'status' => ['Withdrawn applications cannot be updated.'],
            ]);
        }

        $application->status = $status;
        $application->shortlisted_at = $status === Application::STATUS_SHORTLISTED ? now() : null;
        $application->rejected_at = $status === Application::STATUS_REJECTED ? now() : null;
        $application->save();

        return $application->refresh();
    }

    public function withdraw(Application $application): Application
    {
        if ($application->status === Application::STATUS_WITHDRAWN) {
            return $application;
        }

        $application->status = Application::STATUS_WITHDRAWN;
        $application->withdrawn_at = now();
        $application->save();

        return $application->refresh();
    }
}
