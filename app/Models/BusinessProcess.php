<?php

namespace App\Models;

use App\Observers\BusinessProcessObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(BusinessProcessObserver::class)]
class BusinessProcess extends Model
{
    protected $fillable = [
        'business_process_node_id',
        'name',
        'file_path',
    ];

    public function businessProcessNode()
    {
        return $this->belongsTo(BusinessProcessNode::class,

        );
    }


    public function getFileUrlAttribute()
    {
        return $this->file_path
            ? asset('storage/' . $this->file_path)
            : null;
    }
}
