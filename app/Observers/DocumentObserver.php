<?php

namespace App\Observers;

use App\Models\Document;
use Illuminate\Support\Facades\Cache;

class DocumentObserver
{
    /**
     * Handle the Document "created" event.
     */
    public function created(Document $document)
    {
        Cache::forget('group_owner_document_count');
        Cache::forget('documents_count');
    }

    public function deleted(Document $document)
    {
        Cache::forget('group_owner_document_count');
        Cache::forget('documents_count');
    }

    public function updated(Document $document)
    {
        if ($document->wasChanged('document_owner')) {
            Cache::forget('group_owner_document_count');
        }
    }

    /**
     * Handle the Document "restored" event.
     */
    public function restored(Document $document): void
    {
        //
    }

    /**
     * Handle the Document "force deleted" event.
     */
    public function forceDeleted(Document $document): void
    {
        //
    }
}
