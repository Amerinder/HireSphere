<?php

namespace App\Services;

use App\Models\Job;
use GuzzleHttp\Client;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use RuntimeException;

class OpenAIResumeAnalysisService
{
    public function __construct(private readonly Client $client = new Client())
    {
    }

    public function analyze(string $resumeText, ?Job $job = null): array
    {
        if (blank(config('services.openai.key'))) {
            return $this->heuristicAnalysis($resumeText, $job);
        }

        $response = $this->client->post('https://api.openai.com/v1/responses', [
            'headers' => [
                'Authorization' => 'Bearer '.config('services.openai.key'),
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => config('services.openai.model', 'gpt-5.4-mini'),
                'input' => $this->buildPrompt($resumeText, $job),
                'text' => [
                    'format' => [
                        'type' => 'json_schema',
                        'name' => 'resume_analysis',
                        'strict' => true,
                        'schema' => $this->schema(),
                    ],
                ],
            ],
            'timeout' => 45,
        ]);

        $payload = json_decode((string) $response->getBody(), true);
        $text = $payload['output_text'] ?? Arr::get($payload, 'output.0.content.0.text');

        if (! is_string($text)) {
            throw new RuntimeException('OpenAI response did not include structured output text.');
        }

        $analysis = json_decode($text, true);

        if (! is_array($analysis)) {
            throw new RuntimeException('OpenAI response was not valid JSON.');
        }

        return $analysis + ['provider' => 'openai'];
    }

    private function buildPrompt(string $resumeText, ?Job $job): string
    {
        $jobContext = $job
            ? "Job title: {$job->title}\nRequired skills: ".implode(', ', $job->skills ?? [])."\nDescription: {$job->description}"
            : 'No target job was provided. Score general job readiness.';

        return <<<PROMPT
Analyze this candidate resume for a recruitment SaaS platform.

Return only the structured JSON requested by the schema.

{$jobContext}

Resume text:
{$resumeText}
PROMPT;
    }

    private function schema(): array
    {
        return [
            'type' => 'object',
            'additionalProperties' => false,
            'required' => ['match_score', 'skills', 'missing_skills', 'strengths', 'profile_suggestions', 'summary'],
            'properties' => [
                'match_score' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 100],
                'skills' => ['type' => 'array', 'items' => ['type' => 'string']],
                'missing_skills' => ['type' => 'array', 'items' => ['type' => 'string']],
                'strengths' => ['type' => 'array', 'items' => ['type' => 'string']],
                'profile_suggestions' => ['type' => 'array', 'items' => ['type' => 'string']],
                'summary' => ['type' => 'string'],
            ],
        ];
    }

    private function heuristicAnalysis(string $resumeText, ?Job $job): array
    {
        $normalized = Str::lower($resumeText);
        $knownSkills = ['php', 'laravel', 'mongodb', 'react', 'javascript', 'tailwind', 'redis', 'docker', 'aws', 'api', 'sql'];
        $skills = array_values(array_filter($knownSkills, fn (string $skill) => str_contains($normalized, $skill)));
        $required = $job?->skills ?? [];
        $missing = array_values(array_filter($required, fn (string $skill) => ! in_array(Str::lower($skill), $skills, true)));
        $score = $required === [] ? min(85, 45 + count($skills) * 6) : max(20, 100 - count($missing) * 15);

        return [
            'provider' => 'local_fallback',
            'match_score' => $score,
            'skills' => $skills,
            'missing_skills' => $missing,
            'strengths' => array_slice($skills, 0, 5),
            'profile_suggestions' => [
                'Add measurable project outcomes.',
                'Include links to portfolio, GitHub, or deployed work.',
                'Mirror the job description keywords where accurate.',
            ],
            'summary' => 'Local fallback analysis generated because OPENAI_API_KEY is not configured.',
        ];
    }
}
