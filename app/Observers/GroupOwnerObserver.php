<?php

namespace App\Observers;

use App\Models\GroupOwner;
use Illuminate\Support\Facades\Cache;

class GroupOwnerObserver
{
    /**
     * Handle the GroupOwner "created" event.
     */
    public function created(GroupOwner $groupOwner): void
    {
        Cache::forget('group_owners');
        Cache::forget('group_owner_document_count');
    }

    /**
     * Handle the GroupOwner "updated" event.
     */
    public function updated(GroupOwner $groupOwner): void
    {
        Cache::forget('group_owners');
        Cache::forget('group_owner_document_count');
    }

    /**
     * Handle the GroupOwner "deleted" event.
     */
    public function deleted(GroupOwner $groupOwner): void
    {
        Cache::forget('group_owners');
        Cache::forget('group_owner_document_count');
    }

    /**
     * Handle the GroupOwner "restored" event.
     */
    public function restored(GroupOwner $groupOwner): void
    {
        //
    }

    /**
     * Handle the GroupOwner "force deleted" event.
     */
    public function forceDeleted(GroupOwner $groupOwner): void
    {
        //
    }
}
