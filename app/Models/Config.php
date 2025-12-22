<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    protected $table = 'configs';

    protected $primaryKey = 'variable';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'variable',
        'value',
    ];
}