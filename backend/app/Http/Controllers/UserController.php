<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'profile_photo' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        // Manejar foto de perfil polimórfica
        if ($request->hasFile('profile_photo')) {
            // Borrar foto anterior si existe
            $oldImage = $user->profileImage;
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

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user->load('profileImage')
        ]);
    }
}
