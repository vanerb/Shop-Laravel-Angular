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
             $basket = Auth::user()->basket()
                   ->where('finished', false)
                   ->with('products')
                   ->firstOrCreate([
                       'user_id' => Auth::id(),
                       'finished' => false,
                   ]);

               return response()->json($basket->load('products'));
        }

        public function addProduct(Request $request)
        {
           $request->validate([
                   'product_id' => 'required|exists:products,id',
                   'quantity' => 'nullable|integer|min:1'
               ]);

               $basket = Auth::user()->basket()
                   ->where('finished', false)
                   ->firstOrCreate([
                       'user_id' => Auth::id(),
                       'finished' => false,
                   ]);

               if ($basket->finished) {
                   return response()->json(['message' => 'Este carrito ya está finalizado'], 400);
               }

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
           $basket = Auth::user()->basket()
                  ->where('finished', false)
                  ->first();

              if (!$basket) {
                  return response()->json(['message' => 'No tienes un carrito activo'], 404);
              }

              $product = $basket->products()->where('product_id', $productId)->first();

              if ($product) {
                  $currentQuantity = $product->pivot->quantity;

                  if ($currentQuantity > 1) {
                      $basket->products()->updateExistingPivot($productId, [
                          'quantity' => $currentQuantity - 1
                      ]);
                  } else {
                      $basket->products()->detach($productId);
                  }
              }

              return response()->json(['message' => 'Cantidad actualizada o producto eliminado']);
        }

        public function clear()
        {
           $basket = Auth::user()->basket()
                  ->where('finished', false)
                  ->first();

              if ($basket) {
                  $basket->products()->detach();
              }

              return response()->json(['message' => 'Carrito vacío']);
        }

    public function checkout()
    {
        $basket = Auth::user()->basket()
            ->where('finished', false)
            ->first();

        if (!$basket) {
            return response()->json(['message' => 'No tienes un carrito activo'], 404);
        }

        if ($basket->products()->count() === 0) {
            return response()->json(['message' => 'El carrito está vacío'], 400);
        }

        // Aquí podrías generar la lógica de pago/facturación
        $basket->finished = true;
        $basket->save();

        return response()->json(['message' => 'Compra finalizada con éxito']);
    }
}
