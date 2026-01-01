<?php

namespace Database\Seeders;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([UserSeeder::class, ConfigSeeder::class]);
        
        if (app()->environment("production")) return;

        $this->call([
            GroupOwnerSeeder::class,
            BusinessProcessNodeSeeder::class,
            BusinessProcessSeeder::class,
            DocumentSeeder::class,

        ]);


    }
}
