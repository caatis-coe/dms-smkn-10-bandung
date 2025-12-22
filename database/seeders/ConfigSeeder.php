<?php

namespace Database\Seeders;

use App\Models\Config;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configs = [
            'group_owner' => 'Kejuruan',
        ];

        foreach ($configs as $variable => $value) {
            Config::updateOrCreate(
                ['variable' => $variable],
                ['value' => $value]
            );
        }
    }
}
