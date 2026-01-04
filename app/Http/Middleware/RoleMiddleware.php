<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        // Not authenticated
        if (!$user || !$user->email_verified_by_admin_at) {
            return redirect()->route('document.index');
        }

        // Role mismatch
        if (!in_array($user->role, $roles, true)) {
            return redirect()->back();
                // ->withErrors(['auth' => 'You are not authorized to access this page.']);
        }

        return $next($request);
    }
}
