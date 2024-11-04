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
        Schema::table('projects', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('statusProyek');          // Kolom tanggal mulai proyek
            $table->integer('required_participants')->default(10)->after('start_date'); // Kolom jumlah partisipan yang dibutuhkan
            $table->integer('participant_count')->default(0)->after('required_participants'); // Kolom jumlah partisipan saat ini
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('start_date');
            $table->dropColumn('required_participants');
            $table->dropColumn('participant_count');
        });
    }
};
