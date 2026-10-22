<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $categories = $user->type === 'admin'
            ? Category::query()
            : $user->categories();

        return $categories->with('user:id,name')->orderBy('name')->get();
    }

    public function all()
    {
        return Category::query()->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        $category = Auth::user()->categories()->create($data);

        return response()->json($category, 201);
    }

    public function show(int $id)
    {
        $user = Auth::user();
        $categories = $user->type === 'admin'
            ? Category::query()
            : $user->categories();

        return $categories->with('user:id,name')->findOrFail($id);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $categories = $user->type === 'admin'
            ? Category::query()
            : $user->categories();
        $category = $categories->findOrFail($id);
        $category->update($data);

        return response()->json($category->load('user:id,name'));
    }

    public function destroy(int $id)
    {
        $user = Auth::user();
        $categories = $user->type === 'admin'
            ? Category::query()
            : $user->categories();
        $category = $categories->findOrFail($id);

        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar una categoría que todavía tiene productos.',
            ], 409);
        }

        $category->delete();

        return response()->json(['message' => 'Categoría eliminada correctamente']);
    }
}
