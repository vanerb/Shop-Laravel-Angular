<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
     use HasFactory;

             protected $fillable = [
                 'name',
                 'description',
                 'price',
                 'user_id',
                 'category_id'
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

             public function category()
             {
                 return $this->belongsTo(Category::class);
             }

          public function baskets()
             {
                 return $this->belongsToMany(Basket::class, 'basket_product')
                             ->withPivot('quantity')
                             ->withTimestamps();
             }
}
