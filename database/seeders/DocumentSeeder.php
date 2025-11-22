<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Seeder;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure storage path exists
        Storage::disk('public')->makeDirectory('documents');

        $users = User::pluck('id')->toArray();

        for ($i = 1; $i <= 24; $i++) {
            $uuid = Str::uuid()->toString();
            $fileName = "sample-{$uuid}.pdf";
            $filePath = "documents/{$fileName}";

            $this->generatePdf("Sample Document {$i}", $fileName);

            $publishedBy = $users[array_rand($users)] ?? null;
            $updatedBy   = $users[array_rand($users)] ?? $publishedBy;

            Document::create([
                'id'              => $uuid,
                'name'            => "Sample Document {$i}",
                'file_path'       => $filePath,
                'published_by'    => $publishedBy,
                'last_updated_by' => $updatedBy,
            ]);
        }
    }

    private function generatePdf(string $title, string $fileName)
    {
        $dompdf = new Dompdf();

        $html = "
            <html>
            <body>
                <h1>{$title}</h1>
                <p>This is an auto-generated sample PDF for testing.</p>
                <small>Generated at: " . now()->toDateTimeString() . "</small>
            </body>
            </html>
        ";

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        Storage::disk('public')->put("documents/{$fileName}", $dompdf->output());
    }
}
