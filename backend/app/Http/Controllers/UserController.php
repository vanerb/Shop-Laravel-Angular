<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Basket;
use App\Models\Image;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function all()
    {
        abort_unless(Auth::user()->type === 'admin', 403);

        return User::with('images')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        abort_unless(Auth::user()->type === 'admin', 403);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'subname' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'prefix' => 'required|string|max:8',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:6',
            'type' => 'required|in:user,admin',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = DB::transaction(function () use ($data, $request) {
            $user = User::create(collect($data)->only([
                'name', 'subname', 'email', 'prefix', 'phone', 'password', 'type',
            ])->all());

            if ($request->hasFile('profile_photo')) {
                $user->images()->create([
                    'path' => $request->file('profile_photo')->store('profile_photos', 'public'),
                    'from' => 'profile_image',
                ]);
            }

            return $user;
        });

        return response()->json($user->load('images'), 201);
    }

    public function destroy(int $id)
    {
        abort_unless(Auth::user()->type === 'admin', 403);
        abort_if((int) Auth::id() === $id, 422, 'No puedes eliminar tu propia cuenta desde aquí.');

        $user = User::with(['images', 'products.images', 'categories.images'])->findOrFail($id);
        abort_if(
            $user->type === 'admin' && User::where('type', 'admin')->count() <= 1,
            409,
            'No se puede eliminar la última cuenta administradora.'
        );
        $products = $user->products;
        $categories = $user->categories;
        abort_if(
            Product::whereIn('category_id', $categories->modelKeys())
                ->where('user_id', '!=', $user->id)
                ->exists(),
            409,
            'No se puede eliminar esta cuenta mientras sus categorías contengan productos de otras cuentas.'
        );
        $baskets = Basket::where('user_id', $user->id)->with('products')->get();
        $imagePaths = $user->images->pluck('path')
            ->merge($products->flatMap(fn (Product $product) => $product->images->pluck('path')))
            ->merge($categories->flatMap(fn (Category $category) => $category->images->pluck('path')))
            ->unique()->values()->all();

        DB::transaction(function () use ($user, $products, $categories, $baskets) {
            foreach ($products as $product) {
                $product->images()->delete();
            }
            foreach ($categories as $category) {
                $category->images()->delete();
            }

            $user->images()->delete();
            $user->tokens()->delete();
            foreach ($baskets as $basket) {
                $basket->products()->detach();
                $basket->delete();
            }
            $products->each->delete();
            $categories->each->delete();
            $user->delete();
        });

        $this->deleteUnusedFiles($imagePaths);

        return response()->json(['message' => 'Usuario eliminado']);
    }

    public function updateProfile(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $isAdmin = Auth::user()->type === 'admin';
        abort_unless($isAdmin || (int) Auth::id() === (int) $user->id, 403);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'subname' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $user->id,
            'prefix' => 'sometimes|nullable|string|max:8',
            'phone' => 'sometimes|nullable|string|max:20',
            'type' => 'sometimes|in:user,admin',
            'profile_photo' => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:5120',
            'deleted_profile_photo' => 'sometimes|boolean',
        ]);

        if (!$isAdmin) {
            unset($data['type']);
        }

        abort_if(
            $isAdmin && ($data['type'] ?? null) === 'user' && $user->type === 'admin'
                && User::where('type', 'admin')->count() <= 1,
            409,
            'No se puede quitar el acceso de la última cuenta administradora.'
        );

        $pathsToDelete = [];

        DB::transaction(function () use ($data, $request, $user, &$pathsToDelete) {
            $user->fill(collect($data)->only(['name', 'subname', 'email', 'prefix', 'phone', 'type'])->all());
            $user->save();

            if ($request->boolean('deleted_profile_photo') || $request->hasFile('profile_photo')) {
                $oldImages = $user->images()->where('from', 'profile_image')->get();
                $pathsToDelete = $oldImages->pluck('path')->all();
                foreach ($oldImages as $image) {
                    $image->delete();
                }
            }

            if ($request->hasFile('profile_photo')) {
                $user->images()->create([
                    'path' => $request->file('profile_photo')->store('profile_photos', 'public'),
                    'from' => 'profile_image',
                ]);
            }
        });

        $this->deleteUnusedFiles($pathsToDelete);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user->load('images'),
        ]);
    }

    private function deleteUnusedFiles(array $paths): void
    {
        foreach (array_unique($paths) as $path) {
            if (!Image::where('path', $path)->exists()) {
                Storage::disk('public')->delete($path);
            }
        }
    }
}
