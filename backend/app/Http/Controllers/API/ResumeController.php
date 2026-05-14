<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnalyzeResumeRequest;
use App\Http\Requests\UploadResumeRequest;
use App\Http\Resources\ResumeResource;
use App\Jobs\AnalyzeResumeJob;
use App\Models\Resume;
use App\Services\ResumeParserService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class ResumeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return ResumeResource::collection(
            Resume::where('student_id', (string) $request->user()->getKey())->latest()->paginate(10)
        );
    }

    public function store(UploadResumeRequest $request, ResumeParserService $parser): ResumeResource
    {
        $file = $request->file('resume');
        $path = $file->store('resumes');
        $absolutePath = Storage::path($path);

        $resume = Resume::create([
            'student_id' => (string) $request->user()->getKey(),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'text' => $parser->extractText($absolutePath),
            'status' => Resume::STATUS_UPLOADED,
        ]);

        return new ResumeResource($resume);
    }

    public function analyze(AnalyzeResumeRequest $request, Resume $resume): ResumeResource
    {
        abort_if((string) $resume->student_id !== (string) $request->user()->getKey(), 403);

        AnalyzeResumeJob::dispatch((string) $resume->getKey(), $request->validated('job_id'));

        return new ResumeResource($resume->refresh());
    }

    public function show(Request $request, Resume $resume): ResumeResource
    {
        abort_if((string) $resume->student_id !== (string) $request->user()->getKey(), 403);

        return new ResumeResource($resume);
    }
}
