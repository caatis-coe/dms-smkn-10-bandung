<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = [
            'sort' => $request->get('sort'),
            'direction' => $request->get('direction', 'asc'),
            'filters' => $request->get('filters', []),
            'per_page' => $request->get('per_page', 10),
        ];

        $directFilters = [
            'name',
            'email',
            'role',
        ];

        $users = User::query()
            ->when(
                $query['sort'],
                fn($q) =>
                $q->orderBy($query['sort'], $query['direction'])
            )
            ->when(true, function ($q) use ($query, $directFilters) {
                foreach ($query['filters'] as $key => $value) {
                    if (!$value) {
                        continue;
                    }

                    if (in_array($key, $directFilters, true)) {
                        // role should be exact match, others partial
                        if ($key === 'role') {
                            $q->where($key, $value);
                        } else {
                            $q->where($key, 'LIKE', "%{$value}%");
                        }
                    }
                }
            })
            ->paginate($query['per_page'])
            ->withQueryString();

        return Inertia::render('user/index', [
            'users' => $users,
            'query' => $query,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,user',
        ]);

        $user->update($validated);

        return back()->with('success', $user->name . "'s role updated.");
    }

    public function verify(Request $request, User $user)
    {
        $user->update([
            'email_verified_at' => now(),
        ]);

        return back()->with('success', $user->name . "is verified.");
    }

    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->withErrors([
                'user' => 'You cannot delete your own account.',
            ]);
        }

        $user->delete();

        return back()->with('success', 'User deleted.');
    }
}
