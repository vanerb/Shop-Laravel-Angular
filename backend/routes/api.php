<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BasketController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::patch('/users/updateProfile/{id}', [UserController::class, 'updateProfile']);

Route::get('/users/all', [UserController::class, 'all']);
Route::delete('users/{id}', [UserController::class, 'destroy']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('productsByUser', [ProductController::class, 'allByUser']);
    Route::apiResource('products', ProductController::class);
});

Route::get('categories/all', [CategoryController::class, 'all']);

Route::middleware('auth:sanctum')->group(function () {
      Route::apiResource('categories', CategoryController::class);
});

Route::get('payments/all', [PaymentController::class, 'all']);

Route::middleware('auth:sanctum')->group(function () {
   Route::apiResource('payments', PaymentController::class);
});

 Route::get('products', [ProductController::class, 'all']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('basket', [BasketController::class, 'index']);
    Route::post('basket/add', [BasketController::class, 'addProduct']);
    Route::delete('basket/remove/{productId}', [BasketController::class, 'removeProduct']);
    Route::delete('basket/clear', [BasketController::class, 'clear']);
});
