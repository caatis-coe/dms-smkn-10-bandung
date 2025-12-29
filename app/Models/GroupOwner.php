<?php

namespace App\Models;

use App\Observers\GroupOwnerObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy(GroupOwnerObserver::class)]
class GroupOwner extends Model
{

    protected $fillable = ['name'];

    public function document(){
        $this->hasMany(Document::class, 'document_owner', 'name');
    }

    public function bpNodes()
    {
        return $this->hasMany(
            BusinessProcessNode::class,
            'group_owner',
            'name'
        );
    }
}
