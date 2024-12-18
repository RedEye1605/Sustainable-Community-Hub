<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Role::create(['name' => 'admin', 'display_name' => 'Administrator']);
        Role::create(['name' => 'user', 'display_name' => 'User']);
        Role::create(['name' => 'pengelola proyek', 'display_name' => 'Pengelola']);
        Role::create(['name' => 'donatur receiver', 'display_name' => 'Receiver']);
    }
}

