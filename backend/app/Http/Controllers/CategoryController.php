<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
     public function index() {
            return Auth::user()->categories()->get();
        }

     public function all() {
                return Category::all();
            }

    public function store(Request $request) {
 $request->validate([
            'name' => 'required|string|max:255',
             'description' => 'required|string|max:255',
        ]);

        // Crea categoría ligada al usuario logueado
        $category = Auth::user()->categories()->create([
            'name' => $request->name,
             'description' => $request->description,
        ]);

        return response()->json($category, 201);
    }

    public function show($id) {
   $category = Auth::user()->categories()->where('id', $id)->firstOrFail();

    return response()->json($category);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
       ]);

       // Buscar categoría que pertenezca al usuario
       $category = Auth::user()->categories()->where('id', $id)->firstOrFail();

       // Actualizar
       $category->update([
        'name' => $request->name,
                     'description' => $request->description,
       ]);

       return response()->json($category);
    }


    public function destroy($id) {
 $category = Auth::user()->categories()->where('id', $id)->firstOrFail();

    // Eliminar
    $category->delete();

    return response()->json(['message' => 'Categoría eliminada correctamente'], 200);
    }
}
