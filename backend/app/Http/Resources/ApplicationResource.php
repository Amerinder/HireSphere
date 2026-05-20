<?php

namespace App\Http\Resources;

use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $job = Job::find($this->job_id);
        $student = User::find($this->student_id);

        return [
            'id' => (string) $this->getKey(),
            'job_id' => (string) $this->job_id,
            'student_id' => (string) $this->student_id,
            'recruiter_id' => (string) $this->recruiter_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'college_name' => $this->college_name,
            'current_cgpa' => $this->current_cgpa,
            'degree' => $this->degree,
            'specialization' => $this->specialization,
            'cover_note' => $this->cover_note,
            'resume_id' => $this->resume_id,
            'cv_original_name' => $this->cv_original_name,
            'cv_url' => $this->cv_path ? url("/api/v1/applications/{$this->getKey()}/cv") : null,
            'status' => $this->status,
            'ai_match_score' => $this->ai_match_score,
            'applied_at' => $this->applied_at?->toIso8601String(),
            'shortlisted_at' => $this->shortlisted_at?->toIso8601String(),
            'rejected_at' => $this->rejected_at?->toIso8601String(),
            'withdrawn_at' => $this->withdrawn_at?->toIso8601String(),
            'job' => $job ? [
                'id' => (string) $job->getKey(),
                'title' => $job->title,
                'company_name' => $job->company_name,
                'location' => $job->location,
                'application_deadline' => $job->application_deadline?->toDateString(),
            ] : null,
            'student' => $student ? [
                'id' => (string) $student->getKey(),
                'name' => $student->name,
                'email' => $student->email,
                'headline' => $student->headline,
            ] : null,
        ];
    }
}
