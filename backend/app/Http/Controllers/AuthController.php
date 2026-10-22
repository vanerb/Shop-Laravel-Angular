<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'subname' => 'required|string|max:255',
            'prefix' => 'required|string|max:8',
            'phone' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'subname.required' => 'Los apellidos son obligatorios.',
            'prefix.required' => 'El prefijo telefónico es obligatorio.',
            'phone.required' => 'El teléfono es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Introduce un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'profile_photo.image' => 'La foto de perfil debe ser una imagen válida.',
            'profile_photo.mimes' => 'La foto debe estar en formato JPG, PNG o WEBP.',
            'profile_photo.max' => 'La foto de perfil no puede superar los 5 MB.',
        ]);

        $user = DB::transaction(function () use ($data, $request) {
            $user = User::create([
                'name' => $data['name'],
                'subname' => $data['subname'],
                'prefix' => $data['prefix'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'password' => $data['password'],
                'type' => 'user',
            ]);

            if ($request->hasFile('profile_photo')) {
                $user->images()->create([
                    'path' => $request->file('profile_photo')->store('profile_photos', 'public'),
                    'from' => 'profile_image',
                ]);
            }

            return $user;
        });

        return response()->json(['user' => $user->load('images')], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();
        if (!$user || !$user->active || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales incorrectas'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'type' => $user->type,
            'token_type' => 'Bearer',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('images'));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function changePassword(Request $request, int $id)
    {
        abort_unless((int) $request->user()->getKey() === $id, 403);

        $data = $request->validate([
            'password' => 'required|string|min:6|same:repeatPassword',
            'repeatPassword' => 'required|string|min:6',
        ]);

        $user = $request->user();
        $user->password = $data['password'];
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
