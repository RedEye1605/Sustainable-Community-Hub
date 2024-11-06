<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->enum('type', ['barang', 'uang']); // Konsisten dengan pilihan di form
            $table->string('category');  
            $table->decimal('target_amount', 12, 2)->nullable(); // Target jumlah uang (jika tipe adalah uang)
            $table->integer('target_items')->nullable(); // Target jumlah barang (jika tipe adalah barang)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donation_requests');
    }
};

