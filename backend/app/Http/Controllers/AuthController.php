<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
     public function register(Request $request)
           {


 $request->validate([
        'name'           => 'required|string|max:255',
        'subname'        => 'required|string|max:255',
        'prefix'         => 'required|string|max:5',
        'phone'          => 'required|string|max:20',
        'email'          => 'required|string|email|max:255|unique:users',
        'password'       => 'required|string|min:6',
        'profile_photo'  => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
         'type'       => 'required|string',
    ]);

    // Crear usuario
    $user = User::create([
        'name'     => $request->name,
        'subname'  => $request->subname,
        'prefix'   => $request->prefix,
        'phone'    => $request->phone,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
        'type'     => $request->type,
    ]);

    // Subir y asociar foto de perfil
    if ($request->hasFile('profile_photo')) {
        // Eliminar foto anterior si existe
        $oldImage = $user->images()->where('from', 'profile_image')->first();
        if ($oldImage) {
            Storage::disk('public')->delete($oldImage->path);
            $oldImage->delete();
        }

        // Guardar nueva foto
        $path = $request->file('profile_photo')->store('profile_photos', 'public');

        $user->images()->create([
            'path' => $path,
            'from' => 'profile_image',
        ]);
    }

    return response()->json(['user' => $user], 201);
           }

           public function login(Request $request)
           {
               $request->validate([
                   'email' => 'required|string|email',
                   'password' => 'required|string',
               ]);

               $user = User::where('email', $request->email)->first();

               if (! $user || ! Hash::check($request->password, $user->password)) {
                   throw ValidationException::withMessages([
                       'email' => ['Credenciales incorrectas'],
                   ]);
               }

               $token = $user->createToken('auth_token')->plainTextToken;
                //$token = Str::random(60); //PROVISIONAL PARA PRUEBAS

                $user->token = $token;
                $user->save();

               return response()->json([
                   'access_token' => $token,
                   'type'=> $user->type,
                   'token_type' => 'Bearer',
               ]);
           }

           public function user(Request $request)
           {
               $user = Auth::user()->load('images');
               return response()->json($user);
           }

           public function logout(Request $request)
           {
               $request->user()->tokens()->delete();
               return response()->json(['message' => 'Logout exitoso']);
           }

       public function changePassword(Request $request, $id){
         $request->validate([
                          'password' => 'required|string',
                          'repeatPassword' => 'required|string',
                      ]);
        $user = User::where('id', $id)->first();

        if($user->password === $user->repeatPassword){
         $user->password = Hash::make($request->password);
        }
    else{
      return response()->json(['message' => 'Las contraseñas no coinciden']);
    }


       }
}
