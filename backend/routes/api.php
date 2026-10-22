<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BasketController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::get('/products', [ProductController::class, 'all']);
Route::get('/categories/all', [CategoryController::class, 'all']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/changePassword/{id}', [AuthController::class, 'changePassword']);

    Route::patch('/users/updateProfile/{id}', [UserController::class, 'updateProfile']);
    Route::get('/users/all', [UserController::class, 'all']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/productsByUser', [ProductController::class, 'allByUser']);
    Route::apiResource('products', ProductController::class)->except(['index']);
    Route::apiResource('categories', CategoryController::class);

    Route::get('/payments/all', [PaymentController::class, 'all']);
    Route::apiResource('payments', PaymentController::class);

    Route::get('/basket', [BasketController::class, 'index']);
    Route::get('/basket/{id}', [BasketController::class, 'byId'])->whereNumber('id');
    Route::post('/basket/add', [BasketController::class, 'addProduct']);
    Route::delete('/basket/remove/{productId}', [BasketController::class, 'removeProduct'])->whereNumber('productId');
    Route::delete('/basket/clear', [BasketController::class, 'clear']);
});
