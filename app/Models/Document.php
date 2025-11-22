<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $keyType = 'string';
    public $incrementing = false
    ;
    protected $fillable = [
        'id',
        'name',
        'file_path',
        'published_by',
        'last_updated_by',
    ];

    // Always load these relationships
    protected $with = [
        'publishedBy:id,name,email,role',
        'lastUpdatedBy:id,name,email,role'
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }

    public function publishedBy()
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    public function lastUpdatedBy()
    {
        return $this->belongsTo(User::class, 'last_updated_by');
    }
}
