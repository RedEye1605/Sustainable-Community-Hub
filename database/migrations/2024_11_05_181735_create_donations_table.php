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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donation_request_id')->constrained('donation_requests')->onDelete('cascade'); // Relasi ke donation_requests
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Relasi ke user yang melakukan donasi
            $table->enum('type', ['barang', 'uang'])->default('barang'); // Jenis donasi
            $table->decimal('amount', 12, 2)->nullable(); // Jumlah uang jika tipe adalah 'uang'
            $table->string('item_description')->nullable(); // Deskripsi barang jika tipe adalah 'barang'
            $table->string('item_image')->nullable(); // Foto barang yang didonasikan
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // Status donasi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
