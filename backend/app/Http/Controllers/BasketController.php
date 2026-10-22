<?php

namespace App\Http\Controllers;

use App\Models\Basket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BasketController extends Controller
{
    public function index()
    {
        $basket = Auth::user()->basket()->where('finished', false)->first();
        if (!$basket) {
            $basket = Auth::user()->basket()->create(['finished' => false]);
        }

        return response()->json($basket->load('products'));
    }

    public function byId(int $id)
    {
        $basket = Auth::user()->basket()
            ->whereKey($id)
            ->where('finished', false)
            ->with('products')
            ->firstOrFail();

        return response()->json($basket);
    }

    public function addProduct(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'nullable|integer|min:1|max:999',
        ]);
        $quantity = $data['quantity'] ?? 1;

        $basket = DB::transaction(function () use ($data, $quantity) {
            $user = User::whereKey(Auth::id())->lockForUpdate()->firstOrFail();
            $basket = $user->basket()->where('finished', false)->first();
            if (!$basket) {
                $basket = $user->basket()->create(['finished' => false]);
            }

            $now = now();
            $wasInserted = DB::table('basket_product')->insertOrIgnore([
                'basket_id' => $basket->id,
                'product_id' => $data['product_id'],
                'quantity' => $quantity,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            if (!$wasInserted) {
                DB::table('basket_product')
                    ->where('basket_id', $basket->id)
                    ->where('product_id', $data['product_id'])
                    ->increment('quantity', $quantity, ['updated_at' => $now]);
            }

            return $basket;
        });

        return response()->json($basket->load('products'));
    }

    public function removeProduct(int $productId)
    {
        $basket = Auth::user()->basket()->where('finished', false)->first();
        if (!$basket) {
            return response()->json(['message' => 'No tienes una cesta activa.'], 404);
        }

        $pivot = DB::table('basket_product')
            ->where('basket_id', $basket->id)
            ->where('product_id', $productId)
            ->first();

        if ($pivot) {
            if ((int) $pivot->quantity > 1) {
                DB::table('basket_product')
                    ->where('basket_id', $basket->id)
                    ->where('product_id', $productId)
                    ->decrement('quantity', 1, ['updated_at' => now()]);
            } else {
                $basket->products()->detach($productId);
            }
        }

        return response()->json($basket->load('products'));
    }

    public function clear()
    {
        $basket = Auth::user()->basket()->where('finished', false)->first();
        if ($basket) {
            $basket->products()->detach();
        }

        return response()->json(['message' => 'Cesta vaciada correctamente.']);
    }
}
