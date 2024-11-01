<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->string('namaProyek', 100); // Nama proyek
            $table->text('deskripsiProyek')->nullable(); // Deskripsi proyek (opsional)
            $table->string('statusProyek', 50)->default('Pending'); // Status proyek
            $table->timestamps(); // Created_at & updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
}
