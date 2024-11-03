<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    // public function viewAny(User $user): bool
    // {
    //     //
    // }

    // /**
    //  * Determine whether the user can view the model.
    //  */
    public function view(User $user, Project $project): bool
    {
        // Allow access if the user is the project owner or an admin
        return $user->id === $project->user_id || $user->roles->contains('name', 'admin');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Allow creation if the user is an admin or a project manager
        return $user->roles->contains('name', 'admin') || $user->roles->contains('name', 'pengelola proyek');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        // Allow update if the user is the project owner or an admin
        return $user->id === $project->user_id || $user->roles->contains('name', 'admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        // Allow deletion if the user is the project owner or an admin
        return $user->id === $project->user_id || $user->roles->contains('name', 'admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    // public function restore(User $user, Project $project): bool
    // {
    //     //
    // }

    // /**
    //  * Determine whether the user can permanently delete the model.
    //  */
    // public function forceDelete(User $user, Project $project): bool
    // {
    //     //
    // }
}
