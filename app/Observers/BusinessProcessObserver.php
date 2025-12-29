<?php

namespace App\Observers;

use App\Models\BusinessProcess;
use Illuminate\Support\Facades\Storage;

class BusinessProcessObserver
{
    /**
     * Handle the BusinessProcess "created" event.
     */
    public function created(BusinessProcess $businessProcess): void
    {
        //
    }

    /**
     * Handle the BusinessProcess "updated" event.
     */
    public function updated(BusinessProcess $businessProcess): void
    {
        //
    }

    private function deleteEvent(BusinessProcess $businessProcess): void
    {
        if (
            $businessProcess->file_path &&
            Storage::disk('public')->exists($businessProcess->file_path)
        ) {
            Storage::disk('public')->delete($businessProcess->file_path);
        }
    }


    /**
     * Handle the BusinessProcess "deleted" event.
     */
    public function deleting(BusinessProcess $businessProcess): void
    {
        $this->deleteEvent($businessProcess);
    }

    /**
     * Handle the BusinessProcess "restored" event.
     */
    public function restored(BusinessProcess $businessProcess): void
    {
        //
    }
}
