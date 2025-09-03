<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Basket;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class BasketController extends Controller
{
        public function index()
        {
            $basket = Auth::user()->basket()->with('products')->firstOrCreate([
                'user_id' => Auth::id(),
            ]);

            return response()->json($basket->load('products'));
        }

        public function addProduct(Request $request)
        {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'nullable|integer|min:1'
            ]);

            $basket = Auth::user()->basket()->firstOrCreate([
                'user_id' => Auth::id(),
            ]);

            $quantity = $request->quantity ?? 1;

            if ($basket->products()->where('product_id', $request->product_id)->exists()) {
                $basket->products()->updateExistingPivot($request->product_id, [
                    'quantity' => \DB::raw("quantity + $quantity")
                ]);
            } else {
                $basket->products()->attach($request->product_id, ['quantity' => $quantity]);
            }

            return response()->json($basket->load('products'));
        }

        public function removeProduct($productId)
        {
            $basket = Auth::user()->basket;

            if ($basket) {
                $basket->products()->detach($productId);
            }

            return response()->json(['message' => 'Producto eliminado']);
        }

        public function clear()
        {
            $basket = Auth::user()->basket;

            if ($basket) {
                $basket->products()->detach();
            }

            return response()->json(['message' => 'Carrito vacío']);
        }
}
