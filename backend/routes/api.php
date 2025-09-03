<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BasketController;
use App\Http\Controllers\PaymentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class);
});

Route::middleware('auth:sanctum')->group(function () {
      Route::apiResource('categories', CategoryController::class);
});

Route::middleware('auth:sanctum')->group(function () {
   Route::apiResource('payments', PaymentController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('basket', [BasketController::class, 'index']);
    Route::post('basket/add', [BasketController::class, 'addProduct']);
    Route::delete('basket/remove/{productId}', [BasketController::class, 'removeProduct']);
    Route::delete('basket/clear', [BasketController::class, 'clear']);
});
