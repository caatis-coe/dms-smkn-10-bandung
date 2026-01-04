<?php

namespace App\Models;

use App\Observers\DocumentObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;


#[ObservedBy(DocumentObserver::class)]
class Document extends Model
{

    protected $fillable = [
        'code',
        'standard',
        'clause',
        'document_type',
        'name',
        'document_owner',
        'status',
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
        'owner:id,name',
        'documentType:id,name'
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
        return $this->belongsTo(GroupOwner::class, 'document_owner');
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class, 'document_type');
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
