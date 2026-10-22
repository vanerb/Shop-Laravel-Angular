<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index()
    {
        return Auth::user()->payments()->latest()->get();
    }

    public function all()
    {
        abort_unless(Auth::user()->type === 'admin', 403);

        return Payment::with(['user', 'basket.products'])->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'basket_id' => 'required|integer|exists:baskets,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'direction' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:32',
            'country' => 'required|string|max:100',
        ]);

        $payment = DB::transaction(function () use ($data) {
            $user = Auth::user();
            $basket = $user->basket()
                ->whereKey($data['basket_id'])
                ->where('finished', false)
                ->with('products')
                ->lockForUpdate()
                ->firstOrFail();

            abort_if($basket->products->isEmpty(), 422, 'No puedes completar una cesta vacía.');

            $total = $basket->products->sum(
                fn ($product) => (float) $product->price * (int) $product->pivot->quantity
            );

            $payment = $user->payments()->create([
                'basket_id' => $basket->id,
                'total' => number_format($total, 2, '.', ''),
                'status' => 'pending',
                'name' => $data['name'],
                'email' => $data['email'],
                'direction' => $data['direction'],
                'city' => $data['city'],
                'zip' => $data['zip'],
                'country' => $data['country'],
            ]);

            $basket->update(['finished' => true]);

            return $payment;
        });

        return response()->json($payment, 201);
    }

    public function show(int $id)
    {
        return Auth::user()->payments()->with('basket.products')->findOrFail($id);
    }

    public function update(Request $request, int $id)
    {
        abort_unless(Auth::user()->type === 'admin', 403);

        $data = $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled',
        ]);

        $payment = Payment::findOrFail($id);
        $payment->update($data);

        return response()->json($payment);
    }

    public function destroy(int $id)
    {
        abort_unless(Auth::user()->type === 'admin', 403);

        Payment::findOrFail($id)->delete();

        return response()->json(['message' => 'Pedido eliminado']);
    }
}
