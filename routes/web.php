<?php

use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('documents.index');
})->name('home');

Route::get('documents', [DocumentController::class, 'index'])
    ->name('documents.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('documents.index');
    })->name('dashboard');

    Route::post('documents', [DocumentController::class, 'store'])
        ->name('documents.store');

    Route::put('documents/{document}', [DocumentController::class, 'update'])
        ->name('documents.update');

    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])
        ->name('documents.destroy');
});


require __DIR__.'/settings.php';
