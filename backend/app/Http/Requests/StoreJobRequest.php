<?php

namespace App\Http\Requests;

use App\Models\Job;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:160'],
            'title' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:5000'],
            'location' => ['required', 'string', 'max:120'],
            'workplace_type' => ['required', Rule::in(['remote', 'onsite', 'hybrid'])],
            'employment_type' => ['required', Rule::in(['internship', 'full_time', 'part_time', 'contract'])],
            'experience_level' => ['required', Rule::in(['entry', 'junior', 'mid', 'senior'])],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'min:0', 'gte:salary_min'],
            'currency' => ['nullable', 'string', 'size:3'],
            'skills' => ['required', 'array', 'min:1', 'max:25'],
            'skills.*' => ['string', 'max:60'],
            'status' => ['sometimes', Rule::in([Job::STATUS_DRAFT, Job::STATUS_OPEN, Job::STATUS_CLOSED])],
        ];
    }
}
