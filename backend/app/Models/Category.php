<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

                 protected $fillable = [
                     'name',
                     'description',

                 ];

                 // Relación polimórfica
                 public function images()
                 {
                     return $this->morphMany(Image::class, 'imageable');
                 }

                 public function coverImage()
                 {
                     return $this->morphOne(Image::class, 'imageable')->where('from', 'cover');
                 }

                 public function user()
                 {
                     return $this->belongsTo(User::class);
                 }


}
