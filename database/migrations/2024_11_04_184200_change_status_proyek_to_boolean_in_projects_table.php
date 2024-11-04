<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Update nilai 'Aktif' menjadi 1 dan 'Nonaktif' menjadi 0
        DB::table('projects')->where('statusProyek', 'Aktif')->update(['statusProyek' => 1]);
        DB::table('projects')->where('statusProyek', 'Nonaktif')->update(['statusProyek' => 0]);

        // Ubah tipe kolom menjadi boolean
        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('statusProyek')->default(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        // Kembalikan tipe kolom menjadi string
        Schema::table('projects', function (Blueprint $table) {
            $table->string('statusProyek')->change();
        });

        // Kembalikan nilai 1 menjadi 'Aktif' dan 0 menjadi 'Nonaktif' jika rollback
        DB::table('projects')->where('statusProyek', 1)->update(['statusProyek' => 'Aktif']);
        DB::table('projects')->where('statusProyek', 0)->update(['statusProyek' => 'Nonaktif']);
    }
};
