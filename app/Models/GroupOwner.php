<?php

namespace App\Models;

use App\Observers\GroupOwnerObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy(GroupOwnerObserver::class)]
class GroupOwner extends Model
{

    protected $fillable = ['name'];

    protected static function booted()
    {
        static::deleting(function (GroupOwner $groupOwner) {
            $groupOwner->bpNodes->each->delete();
        });
    }

    public function document(){
        return $this->hasMany(Document::class, 'document_owner', 'name');
    }

    public function bpNodes()
    {
        return $this->hasMany(
            BusinessProcessNode::class,
            'group_owner',
            'id'
        );
    }
}
