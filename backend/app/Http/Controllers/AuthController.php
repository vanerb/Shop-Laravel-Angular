<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
     public function register(Request $request)
           {
               $request->validate([
                   'name' => 'required|string',
                    'subname' => 'required|string',
                     'prefix' => 'required|string',
                      'phone' => 'required|string',
                   'email' => 'required|string|email|unique:users',
                   'password' => 'required|string|min:6',
               ]);

               $user = User::create([
                   'name' => $request->name,
                    'subname' => $request->subname,
                     'prefix' => $request->prefix,
                      'phone' => $request->phone,
                   'email' => $request->email,
                   'password' => Hash::make($request->password),
                   'type'=>'user'
               ]);

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
               return response()->json($request->user());
           }

           public function logout(Request $request)
           {
               $request->user()->tokens()->delete();
               return response()->json(['message' => 'Logout exitoso']);
           }
}
