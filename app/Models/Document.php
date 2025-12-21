<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'standard',
        'clause',
        'document_type',
        'name',
        'document_owner',
        'file_path',
        'supporting_file_path',
        'application_link',
        'revision',
        'effective_date',
        'published_by',
        'last_updated_by',
    ];

    // Auto eager load
    protected $with = [
        'publishedBy:id,name,email,role',
        'lastUpdatedBy:id,name,email,role',
        'owner:name',
    ];

    protected $casts = [
        'effective_date' => 'date',
    ];

    protected $appends = [
        'file_url',
        'supporting_file_url',
    ];

    /* ================= Relationships ================= */

    public function publishedBy()
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    public function lastUpdatedBy()
    {
        return $this->belongsTo(User::class, 'last_updated_by');
    }

    public function owner()
    {
        return $this->belongsTo(GroupOwner::class, 'document_owner', 'name');
    }

    /* ================= Accessors ================= */

    public function getFileUrlAttribute()
    {
        return $this->file_path
            ? asset('storage/' . $this->file_path)
            : null;
    }

    public function getSupportingFileUrlAttribute()
    {
        return $this->supporting_file_path
            ? asset('storage/' . $this->supporting_file_path)
            : null;
    }
}
