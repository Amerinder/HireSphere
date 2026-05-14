<?php

namespace App\Jobs;

use App\Models\Application;
use App\Models\Job;
use App\Models\Resume;
use App\Services\OpenAIResumeAnalysisService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class AnalyzeResumeJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $resumeId,
        public readonly ?string $jobId = null,
    ) {
    }

    public function handle(OpenAIResumeAnalysisService $analysisService): void
    {
        $resume = Resume::findOrFail($this->resumeId);
        $job = $this->jobId ? Job::find($this->jobId) : null;

        $resume->forceFill([
            'status' => Resume::STATUS_PROCESSING,
            'failure_reason' => null,
        ])->save();

        $analysis = $analysisService->analyze($resume->text ?? '', $job);

        $resume->forceFill([
            'status' => Resume::STATUS_ANALYZED,
            'analysis' => $analysis,
            'analyzed_at' => now(),
        ])->save();

        if ($job) {
            Application::where('job_id', (string) $job->getKey())
                ->where('student_id', (string) $resume->student_id)
                ->update(['ai_match_score' => $analysis['match_score'] ?? null]);
        }
    }

    public function failed(Throwable $exception): void
    {
        Resume::where('_id', $this->resumeId)->update([
            'status' => Resume::STATUS_FAILED,
            'failure_reason' => $exception->getMessage(),
        ]);
    }
}
