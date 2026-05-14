<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'headline' => ['nullable', 'string', 'max:160'],
            'location' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'skills' => ['nullable', 'array', 'max:30'],
            'skills.*' => ['string', 'max:60'],
            'bio' => ['nullable', 'string', 'max:1200'],
            'company.name' => ['nullable', 'string', 'max:160'],
            'company.website' => ['nullable', 'url', 'max:255'],
            'company.industry' => ['nullable', 'string', 'max:120'],
            'company.size' => ['nullable', 'string', 'max:80'],
            'company.location' => ['nullable', 'string', 'max:120'],
            'company.description' => ['nullable', 'string', 'max:1200'],
        ];
    }
}
