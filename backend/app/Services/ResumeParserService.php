<?php

namespace App\Services;

use Smalot\PdfParser\Parser;
use Throwable;

class ResumeParserService
{
    public function extractText(string $absolutePath): string
    {
        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($absolutePath);

            return trim(preg_replace('/\s+/', ' ', $pdf->getText()) ?? '');
        } catch (Throwable) {
            $raw = file_get_contents($absolutePath) ?: '';
            preg_match_all('/\(([^()]*)\)\s*Tj/', $raw, $matches);

            return trim(preg_replace('/\s+/', ' ', implode(' ', $matches[1] ?? [])) ?? '');
        }
    }
}
