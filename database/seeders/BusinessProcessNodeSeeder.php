<?php

namespace Database\Seeders;

use App\Models\BusinessProcessNode;
use App\Models\GroupOwner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BusinessProcessNodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure group owners exist
        $owners = GroupOwner::pluck('name')->toArray();

        if (empty($owners)) {
            return;
        }

        foreach ($owners as $ownerName) {

            /**
             * =========================
             * CHAPTER 1.0
             * =========================
             */
            $chapter1 = BusinessProcessNode::create([
                'group_owner'      => $ownerName,
                'parent_id'        => null,
                'code'             => '1.0',
                'name'             => 'Bagian Dari Direktur',
                'level'            => 1,
                'order'            => 1,
            ]);

            BusinessProcessNode::create([
                'group_owner'      => $ownerName,
                'parent_id'        => $chapter1->id,
                'code'             => '1.1',
                'name'             => 'Kepala Urusan',
                'level'            => 2,
                'order'            => 1,
            ]);

            BusinessProcessNode::create([
                'group_owner'      => $ownerName,
                'parent_id'        => $chapter1->id,
                'code'             => '1.2',
                'name'             => 'Sekretaris',
                'level'            => 2,
                'order'            => 2,
            ]);

            /**
             * =========================
             * CHAPTER 2.0
             * =========================
             */
            BusinessProcessNode::create([
                'group_owner'      => $ownerName,
                'parent_id'        => null,
                'code'             => '2.0',
                'name'             => 'Bagian Dari Anggota',
                'level'            => 1,
                'order'            => 2,
            ]);

            /**
             * =========================
             * CHAPTER 3.0
             * =========================
             */
            BusinessProcessNode::create([
                'group_owner'      => $ownerName,
                'parent_id'        => null,
                'code'             => '3.0',
                'name'             => 'Bagian Lainnya',
                'level'            => 1,
                'order'            => 3,
            ]);
        }
    }
}
