<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

     public function all(){
        return User::with('images')->get();
    }

public function destroy($id){
$user = User::where('id', $id)->first();

           foreach ($user->images as $img) {
               Storage::disk('public')->delete($img->path);
           }

           $user->delete();

           return response()->json(['message' => 'Usuario eliminado']);
}


    public function updateProfile(Request $request, $id)
    {
        $user = User::where('id', $id)->firstOrFail();

        $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'profile_photo' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
                                'subname' => 'sometimes|string',
                                 'prefix' => 'sometimes|string',
                                  'phone' => 'sometimes|string',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

 if ($request->has('subname')) {
            $user->subname = $request->subname;
        }

     if ($request->has('prefix')) {
                $user->prefix = $request->prefix;
            }

        if ($request->has('phone')) {
                        $user->phone = $request->phone;
                    }



        // Manejar foto de perfil polimórfica
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

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user->load('profileImage')
        ]);
    }
}
