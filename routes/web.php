<?php

use App\Http\Controllers\BusinessProcessController;
use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('document.index');
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


    Route::prefix('business-process')->group(function () {
        Route::get('', [BusinessProcessController::class, 'index'])
            ->name('business-process.index');

        Route::post('', [BusinessProcessController::class, 'store'])
            ->name('business-process.store');

        Route::put('{businessProcess}', [BusinessProcessController::class, 'update'])
            ->name('business-process.update');

        Route::delete('{businessProcess}', [BusinessProcessController::class, 'destroy'])
            ->name('business-process.destroy');
    });
});


require __DIR__ . '/settings.php';
