<?php

use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('documents.index');
})->name('home');

Route::get('document', [DocumentController::class, 'index'])
    ->name('document.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('document.index');
    })->name('dashboard');

    Route::prefix('document')->group(function () {
        Route::post('', [DocumentController::class, 'store'])
            ->name('document.store');

        Route::put('{document}', [DocumentController::class, 'update'])
            ->name('document.update');

        Route::delete('{document}', [DocumentController::class, 'destroy'])
            ->name('document.destroy');
    });


    Route::prefix()->group(function () {
        
    });


});


require __DIR__ . '/settings.php';
