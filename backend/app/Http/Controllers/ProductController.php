<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index() {
        return Product::with(['images', 'category'])->get();
    }

public function store(Request $request) {
     $data = $request->validate([
               'name' => 'required|string|max:255',
               'description' => 'nullable|string',
               'price' => 'required|numeric',
               'category_id' => 'required|exists:categories,id',
               'images.*' => 'nullable|image|max:2048',
               'cover_image' => 'nullable|image|max:2048',
           ]);

           DB::transaction(function () use ($data, $request, &$product) {
               $product = Product::create([
                   'name' => $data['name'],
                   'description' => $data['description'] ?? '',
                   'price' => $data['price'],
                   'user_id' => auth()->id(),
                   'category_id' => $data['category_id'],
               ]);

               // Imagen de portada
               if ($request->hasFile('cover_image')) {
                   $path = $request->file('cover_image')->store('products', 'public');
                   $product->images()->create([
                       'path' => $path,
                       'from' => 'cover',
                   ]);
               }

               // Galería de imágenes
               if ($request->hasFile('images')) {
                   foreach ($request->file('images') as $img) {
                       $path = $img->store('products', 'public');
                       $product->images()->create([
                           'path' => $path,
                           'from' => 'gallery',
                       ]);
                   }
               }
           });

           return response()->json($product->load('images'), 201);
}

public function show($id) {
  $product = Product::where('id', $id)->first();
    return $product->load('images');
}

public function update(Request $request, $id) {
   $data = $request->validate([
              'name' => 'sometimes|string|max:255',
              'description' => 'nullable|string',
              'price' => 'sometimes|numeric',
              'category_id' => 'sometimes|exists:categories,id',
              'images.*' => 'nullable|image|max:2048',
              'cover_image' => 'nullable|image|max:2048',
          ]);


           $product = Product::where('id', $id)->first();



        $updateData = [];
        if ($request->filled('name')) $updateData['name'] = $request->name;
        if ($request->has('description')) $updateData['description'] = $request->description; // puede ser null
        if ($request->filled('price')) $updateData['price'] = $request->price;
        if ($request->filled('category_id')) $updateData['category_id'] = $request->category_id;

        $product->update($updateData);


           if ($request->hasFile('cover_image')) {
                            // eliminar portada anterior
                            $product->coverImage?->delete();
                            $path = $request->file('cover_image')->store('products', 'public');
                            $product->images()->create([
                                'path' => $path,
                                'from' => 'cover',
                            ]);
                        }

                        // Agregar imágenes nuevas a la galería
                        if ($request->hasFile('images')) {
                            foreach ($request->file('images') as $img) {
                                $path = $img->store('products', 'public');
                                $product->images()->create([
                                    'path' => $path,
                                    'from' => 'gallery',
                                ]);
                            }
                        }

          return response()->json($product->load('images'));
}


public function destroy($id) {
           foreach ($product->images as $img) {
               Storage::disk('public')->delete($img->path);
           }

           $product->delete();

           return response()->json(['message' => 'Producto eliminado']);
}

}
