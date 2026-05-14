<?php

namespace App\Repositories;

use App\Models\Job;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class JobRepository
{
    public function paginateOpen(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Job::query()->where('status', Job::STATUS_OPEN);

        if (! empty($filters['q'])) {
            $search = preg_quote((string) $filters['q'], '/');
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'regexp', "/{$search}/i")
                    ->orWhere('company_name', 'regexp', "/{$search}/i")
                    ->orWhere('description', 'regexp', "/{$search}/i");
            });
        }

        if (! empty($filters['location'])) {
            $query->where('location', 'regexp', '/'.preg_quote((string) $filters['location'], '/').'/i');
        }

        if (! empty($filters['workplace_type'])) {
            $query->where('workplace_type', $filters['workplace_type']);
        }

        if (! empty($filters['experience_level'])) {
            $query->where('experience_level', $filters['experience_level']);
        }

        if (! empty($filters['skill'])) {
            $query->where('skills', (string) $filters['skill']);
        }

        if (! empty($filters['salary_min'])) {
            $query->where('salary_max', '>=', (int) $filters['salary_min']);
        }

        if (! empty($filters['salary_max'])) {
            $query->where('salary_min', '<=', (int) $filters['salary_max']);
        }

        $sort = $filters['sort'] ?? 'latest';

        if ($sort === 'salary_high') {
            $query->orderByDesc('salary_max');
        } elseif ($sort === 'salary_low') {
            $query->orderBy('salary_min');
        } else {
            $query->latest();
        }

        return $query
            ->paginate($perPage);
    }

    public function paginateForRecruiter(User $recruiter, int $perPage = 12): LengthAwarePaginator
    {
        return Job::query()
            ->where('recruiter_id', (string) $recruiter->getKey())
            ->latest()
            ->paginate($perPage);
    }

    public function createForRecruiter(User $recruiter, array $data): Job
    {
        $status = $data['status'] ?? Job::STATUS_OPEN;

        return Job::create([
            ...$data,
            'recruiter_id' => (string) $recruiter->getKey(),
            'currency' => $data['currency'] ?? 'USD',
            'status' => $status,
            'published_at' => $status === Job::STATUS_OPEN ? now() : null,
        ]);
    }

    public function update(Job $job, array $data): Job
    {
        if (($data['status'] ?? $job->status) === Job::STATUS_OPEN && ! $job->published_at) {
            $data['published_at'] = now();
        }

        $job->update($data);

        return $job->refresh();
    }
}
