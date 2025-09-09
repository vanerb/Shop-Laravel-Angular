<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;

class PaymentController extends Controller
{



    public function index() {
                return Auth::user()->payments()->get();
            }

         public function all() {
                            return Payment::all();
                        }

        public function store(Request $request) {
   $request->validate([
          'basket_id' => 'required|exists:baskets,id',
          'total' => 'required|string|max:255',
          'status' => 'required|string|max:255',
          'name' => 'required|string|max:255',
          'email' => 'required|string|max:255',
          'direction' => 'required|string|max:255',
          'city' => 'required|string|max:255',
          'zip' => 'required|string|max:255',
          'country' => 'required|string|max:255',
      ]);

      $payment = Auth::user()->payments()->where('basket_id', $request->basket_id)->first();
      if (!is_null($payment)) {
          return response()->json(['message' => 'Ya existe'], 201);
      }

    $basket = Auth::user()->basket()->where('id', $request->basket_id)->firstOrFail();

    $basket->finished = 1;
    $basket->save();

      $payment = Auth::user()->payments()->create([
          'basket_id' => $request->basket_id,
          'total' => $request->total,
          'status' => $request->status,
          'name' => $request->name,
          'email' => $request->email,
          'direction' => $request->direction,
          'city' => $request->city,
          'zip' => $request->zip,
          'country' => $request->country,
      ]);

      return response()->json($payment, 201);
        }

        public function show($id) {
       $category = Auth::user()->payment()->where('id', $id)->firstOrFail();

        return response()->json($category);
        }

        public function update(Request $request, $id) {
            $request->validate([
                'total' => 'required|string|max:255',
                                 'status' => 'required|string|max:255',
                                  'name' => 'required|string|max:255',
                                   'email' => 'required|string|max:255',
                                    'direction' => 'required|string|max:255',
                                    'city' => 'required|string|max:255',
                                     'zip' => 'required|string|max:255',
                                      'country' => 'required|string|max:255',
           ]);

           // Buscar categoría que pertenezca al usuario
           $payment = Auth::user()->payments()->where('id', $id)->firstOrFail();

           // Actualizar
           $payment->update([
            'total' => $request->total,
                            'status' => $request->status,
                            'name' => $request->name,
                            'email' => $request->email,
                            'direction' => $request->direction,
                             'city' => $request->city,
                            'zip' => $request->zip,
                            'country' => $request->country,
           ]);

           return response()->json($payment);
        }


        public function destroy($id) {
     $payment = Auth::user()->payments()->where('id', $id)->firstOrFail();

        // Eliminar
        $payment->delete();

        return response()->json(['message' => 'Categoría eliminada correctamente'], 200);
        }
}
