<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/image/{directory}/{filename}', function (string $directory, string $filename) {
    abort_unless(in_array($directory, ['products', 'profile_photos', 'general'], true), 404);

    $path = $directory . '/' . basename($filename);
    abort_unless(Storage::disk('public')->exists($path), 404);

    return Storage::disk('public')->response($path, basename($filename), [
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('filename', '[^/]+');
