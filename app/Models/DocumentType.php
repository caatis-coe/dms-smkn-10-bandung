<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    protected $fillable = [
        'name',
    ];

    protected static function booted()
    {
        static::deleting(function (DocumentType $documentType) {
            $documentType->documents->each->delete();
        });
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'document_type');
    }
}
