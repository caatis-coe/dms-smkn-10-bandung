<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupOwner extends Model
{
    protected $primaryKey = 'name';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['name'];

    public function bpNodes()
    {
        return $this->hasMany(
            BusinessProcessNode::class,
            'group_owner_name',
            'name'
        );
    }
}
