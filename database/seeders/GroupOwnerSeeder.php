<?php

namespace Database\Seeders;

use App\Models\GroupOwner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GroupOwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = [
            'Bagian Satuan Penjaminan Mutu',
            'Bagian Aset',
            'Bagian Admisi',
            'Program Studi',
            'Direktorat Sumber Daya Manusia',
            'Bagian Open Library',
            'Direktorat Sistem Informasi',
            'Direktorat Keuangan',
            'Direktorat Akademik',
        ];

        foreach ($owners as $name) {
            GroupOwner::create([
                'name' => $name,
            ]);
        }
    }
}
