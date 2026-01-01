<?php

namespace App\Responses;

use Laravel\Fortify\Contracts\LoginResponse;

class ClearIntendedLoginResponse implements LoginResponse  
{
    public function toResponse($request)
    {
        $request->session()->forget('url.intended');

        return redirect()->route('dashboard');
    }
}
