<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cover_note' => ['nullable', 'string', 'max:1500'],
            'resume_id' => ['nullable', 'string', 'max:80'],
        ];
    }
}
