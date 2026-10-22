<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function all()
    {
        return Product::with(['images', 'category'])->orderByDesc('created_at')->get();
    }

    public function allByUser()
    {
        $user = Auth::user();
        $products = $user->type === 'admin'
            ? Product::query()
            : $user->products();

        return $products->with(['images', 'category'])->orderByDesc('created_at')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|integer|exists:categories,id',
            'images' => 'sometimes|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = Auth::user();
        $categoryQuery = Category::query()->whereKey($data['category_id']);
        if ($user->type !== 'admin') {
            $categoryQuery->where('user_id', $user->id);
        }
        $categoryQuery->firstOrFail();

        $product = DB::transaction(function () use ($data, $request, $user) {
            $product = $user->products()->create([
                'name' => $data['name'],
                'description' => $data['description'] ?? '',
                'price' => $data['price'],
                'category_id' => $data['category_id'],
            ]);

            $this->storeImages($product, $request);

            return $product;
        });

        return response()->json($product->load(['images', 'category']), 201);
    }

    public function show(int $id)
    {
        return Product::with(['images', 'category'])->findOrFail($id);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'images' => 'sometimes|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'deleted_images' => 'sometimes|array',
            'deleted_images.*' => 'integer',
            'deleted_cover_image' => 'sometimes|boolean',
        ]);

        $product = Product::with('images')->findOrFail($id);
        $this->authorizeProduct($product);

        if (isset($data['category_id'])) {
            $categoryQuery = Category::query()->whereKey($data['category_id']);
            if (Auth::user()->type !== 'admin') {
                $categoryQuery->where('user_id', Auth::id());
            }
            $categoryQuery->firstOrFail();
        }

        $pathsToDelete = [];

        DB::transaction(function () use ($request, $data, $product, &$pathsToDelete) {
            $product->fill(collect($data)->only(['name', 'description', 'price', 'category_id'])->all());
            $product->save();

            if (!empty($data['deleted_images'])) {
                $images = $product->images()->whereIn('id', $data['deleted_images'])->get();
                foreach ($images as $image) {
                    $pathsToDelete[] = $image->path;
                    $image->delete();
                }
            }

            $cover = $product->images()->where('from', 'cover')->first();
            if ($cover && ($request->boolean('deleted_cover_image') || $request->hasFile('cover_image'))) {
                $pathsToDelete[] = $cover->path;
                $cover->delete();
            }

            $this->storeImages($product, $request);
        });

        $this->deleteUnusedFiles($pathsToDelete);

        return response()->json($product->load(['images', 'category']));
    }

    public function destroy(int $id)
    {
        $product = Product::with('images')->findOrFail($id);
        $this->authorizeProduct($product);
        $paths = $product->images->pluck('path')->all();

        DB::transaction(function () use ($product) {
            $product->images()->delete();
            $product->delete();
        });

        $this->deleteUnusedFiles($paths);

        return response()->json(['message' => 'Producto eliminado']);
    }

    private function authorizeProduct(Product $product): void
    {
        abort_unless(
            Auth::user()->type === 'admin' || (int) $product->user_id === (int) Auth::id(),
            403
        );
    }

    private function storeImages(Product $product, Request $request): void
    {
        if ($request->hasFile('cover_image')) {
            $product->images()->create([
                'path' => $request->file('cover_image')->store('products', 'public'),
                'from' => 'cover',
            ]);
        }

        foreach ($request->file('images', []) as $image) {
            $product->images()->create([
                'path' => $image->store('products', 'public'),
                'from' => 'gallery',
            ]);
        }
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
