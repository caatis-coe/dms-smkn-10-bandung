<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessProcess extends Model
{
    
    public function getFileUrlAttribute()
    {
        return $this->file_path
            ? asset('storage/' . $this->file_path)
            : null;
    }
}
