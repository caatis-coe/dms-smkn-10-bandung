<?php

use App\Http\Controllers\BusinessProcessController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\GroupOwnerController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('document.index');
})->name('home');

Route::get('document', [DocumentController::class, 'index'])
    ->name('document.index');

Route::middleware(['auth', 'verified', 'role:admin,user'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('document.index');
    })->name('dashboard');

    Route::prefix('document')->middleware('role:admin')->group(function () {
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

        Route::middleware('role:admin')->group(function () {
            Route::post('', [BusinessProcessController::class, 'store'])
                ->name('business-process.store');

            Route::post('node', [BusinessProcessController::class, 'storeNode'])
                ->name('business-process.storeNode');

            Route::put('node/{node}', [BusinessProcessController::class, 'updateNode'])
                ->name('business-process.updateNode');

            Route::delete('node/{node}', [BusinessProcessController::class, 'destroyNode'])
                ->name('business-process.destroyNode');

            Route::put('{businessProcess}', [BusinessProcessController::class, 'update'])
                ->name('business-process.update');

            Route::delete('{businessProcess}', [BusinessProcessController::class, 'destroy'])
                ->name('business-process.destroy');
        });
    });

    Route::middleware('role:admin')->group(function () {
        Route::prefix('user')->group(function () {
            Route::get('', [UserController::class, 'index'])
                ->name('user.index');
    
            Route::put('role/{user}', [UserController::class, 'updateRole'])
                ->name('user.updateRole');
    
            Route::put('verify/{user}', [UserController::class, 'verify'])
                ->name('user.verify');
    
            Route::delete('{user}', [UserController::class, 'destroy'])
                ->name('user.destroy');
        });
    
        Route::prefix('group-owner')->group(function () {
            Route::get('', [GroupOwnerController::class, 'index'])
                ->name('group-owner.index');
    
            Route::post('', [GroupOwnerController::class, 'store'])
                ->name('group-owner.store');
    
            Route::put('name', [GroupOwnerController::class, 'changeName'])
                ->name('group-owner.changeName');
    
            Route::put('{groupOwner}', [GroupOwnerController::class, 'update'])
                ->name('group-owner.update');
    
            Route::delete('{groupOwner}', [GroupOwnerController::class, 'destroy'])
                ->name('group-owner.destroy');
        });
    });
    
});


require __DIR__ . '/settings.php';
