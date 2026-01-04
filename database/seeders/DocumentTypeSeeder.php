<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DocumentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

     
    public function run(): void
    {
        $owners = [
            'Prosedur',
            'Instruksi',
            'Dokumen Lain'
        ];

        foreach ($owners as $name) {
            DocumentType::create([
                'name' => $name,
            ]);
        }
    }
}
