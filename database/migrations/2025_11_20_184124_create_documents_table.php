<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            // Existing columns (kept)
            $table->string('id')->primary();
            $table->string('standard')->nullable();
            $table->string('clause')->nullable();
            $table->enum('document_type', ['prosedur', 'instruksi', 'dokumen_lain']);
            $table->string('name');
            $table->string('document_owner')->nullable();
            $table->foreign('document_owner')
                ->references('name')
                ->on('group_owners')
                ->nullOnDelete();
            $table->string('file_path');
            $table->string('supporting_file_path')->nullable();
            $table->string('application_link')->nullable();
            $table->string('revision')->nullable();
            $table->date('effective_date')->nullable();

            $table->foreignId('published_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('last_updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
