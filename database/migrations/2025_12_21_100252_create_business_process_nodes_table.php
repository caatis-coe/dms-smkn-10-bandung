<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('business_process_nodes', function (Blueprint $table) {
            $table->id();
        
            // STRING FK → group_owners.name
            $table->string('group_owner');
            $table->foreign('group_owner')
                ->references('name')
                ->on('group_owners')
                ->cascadeOnDelete();
        
            // Self-referencing hierarchy
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('business_process_nodes')
                ->cascadeOnDelete();
        
            $table->string('code');   // "1.0", "1.1"
            $table->string('name');   // Chapter name
            $table->unsignedTinyInteger('level'); // 1 = chapter, 2 = subchapter
            $table->unsignedInteger('order')->default(0);
        
            $table->timestamps();
        
            $table->unique(['group_owner_name', 'code']);
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_process_nodes');
    }
};
