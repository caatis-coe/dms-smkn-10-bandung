<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessProcessNode extends Model
{
    protected $fillable = [
        'group_owner',
        'parent_id',
        'code',
        'name',
        'level',
        'order',
    ];

    public function groupOwner()
    {
        return $this->belongsTo(
            GroupOwner::class
        );
    }

    protected static function booted()
    {
        static::deleting(function ($node) {
            $node->children->each->delete();
            $node->processes->each->delete();
        });
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function processes()
    {
        return $this->hasMany(BusinessProcess::class);
    }
}