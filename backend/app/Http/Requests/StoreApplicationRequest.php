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
            'first_name' => ['required', 'string', 'max:80'],
            'last_name' => ['required', 'string', 'max:80'],
            'college_name' => ['required', 'string', 'max:160'],
            'current_cgpa' => ['required', 'numeric', 'min:0', 'max:10'],
            'degree' => ['required', 'string', 'max:120'],
            'specialization' => ['required', 'string', 'max:120'],
            'cover_note' => ['nullable', 'string', 'max:1500'],
            'resume_id' => ['nullable', 'string', 'max:80'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ];
    }
}
