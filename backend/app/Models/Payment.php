<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
     use HasFactory;

                     protected $fillable = [
                         'basket_id',
                         'total',
                         'status',
                         'name',
                         'email',
                         'direction',
                         'city',
                         'zip',
                         'country',

                     ];

                     public function user()
                     {
                         return $this->belongsTo(User::class);
                     }

}
