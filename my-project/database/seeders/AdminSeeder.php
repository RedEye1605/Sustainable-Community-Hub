<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Temukan atau buat pengguna admin
        $user = User::firstOrCreate([
            'email' => 'admin@example.com', // Ganti dengan email admin
        ], [
            'name' => 'Admin',
            'password' => bcrypt('password'), // Ganti dengan password admin
        ]);

        // Temukan atau buat role admin
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Tetapkan role admin ke pengguna
        $user->roles()->sync([$adminRole->id]);
    }
}