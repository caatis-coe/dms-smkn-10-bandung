<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\User;
use App\Models\GroupOwner;
use Illuminate\Database\Seeder;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        Storage::disk('public')->makeDirectory('documents');
        Storage::disk('public')->makeDirectory('supporting-documents');

        $users = User::pluck('id')->toArray();
        $owners = GroupOwner::pluck('id')->toArray();

        $standards = [
            'Dokumen ISO 21001:2018',
            'Dokumen ISO 9001:2015',
            'Dokumen ISO 27001:2022',
            'Dokumen Internal Universitas'
        ];

        $clauses = [
            '7.1.3', '7.3', '8.5.1', '8.5.2', '8.5.5',
            '7.5.1', '7.5.3.2', '7.1.6.2'
        ];

        $types = ['prosedur', 'instruksi', 'dokumen_lain'];

        for ($i = 1; $i <= 24; $i++) {

            $uuid = Str::uuid()->toString();

            // MAIN FILE
            $mainFile = "doc-{$uuid}.pdf";
            $mainPath = "documents/{$mainFile}";
            $this->generatePdf("Sample Document {$i}", $mainFile);

            // SUPPORTING FILE
            $supportingFile = "support-{$uuid}.pdf";
            $supportingPath = "supporting-documents/{$supportingFile}";
            $this->generatePdf("Supporting File for {$i}", $supportingFile);

            Document::create([
                'code'                   => $uuid,
                'name'                 => "Sample Document {$i}",
                'standard'             => $standards[array_rand($standards)],
                'clause'               => $clauses[array_rand($clauses)],
                'document_type'        => $types[array_rand($types)],
                'document_owner'       => $owners[array_rand($owners)] ?? null,
                'file_path'            => $mainPath,
                'supporting_file_path' => rand(0, 1) 
                                            ? $supportingPath
                                            : null,
                'application_link'     => rand(0, 1)
                                            ? 'https://www.google.com/search?q=sunda'
                                            : null,
                'revision'             => rand(0, 1)
                                            ? sprintf('%02d', rand(0, 10))
                                            : null,
                'effective_date'       => now()->subDays(rand(10, 200))->format('Y-m-d'),

                'published_by'         => $users[array_rand($users)] ?? null,
                'last_updated_by'      => $users[array_rand($users)] ?? null,
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
        Storage::disk('public')->put("supporting-documents/{$fileName}", $dompdf->output());
    }
}
