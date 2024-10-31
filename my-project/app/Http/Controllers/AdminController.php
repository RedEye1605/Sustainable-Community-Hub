<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

/**
 * @method \Illuminate\Routing\Controller middleware(array|string|null $middleware, array $options = [])
 */
class AdminController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        $roles = Role::all();

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function assignRole(Request $request)
    {
        $user = User::find($request->user_id);
        $role = Role::where('name', $request->role_name)->first();

        if ($user && $role) {
            $user->roles()->syncWithoutDetaching([$role->id]);
        }

        return redirect()->route('admin.dashboard')->with('status', 'Role berhasil diberikan');
    }
}