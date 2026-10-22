<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiCommerceFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_validation_always_returns_a_json_error(): void
    {
        $this->post('/api/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'subname', 'prefix', 'phone', 'email', 'password']);
    }

    public function test_registration_login_and_authenticated_profile_work(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Demo',
            'subname' => 'User',
            'prefix' => '+34',
            'phone' => '600000000',
            'email' => 'demo@example.test',
            'password' => 'password123',
        ])->assertCreated()
            ->assertJsonPath('user.email', 'demo@example.test');

        $token = $this->postJson('/api/login', [
            'email' => 'demo@example.test',
            'password' => 'password123',
        ])->assertOk()->json('access_token');

        $this->withToken($token)->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('email', 'demo@example.test');

        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseMissing('personal_access_tokens', ['token' => hash('sha256', $token)]);
    }

    public function test_basket_addition_and_checkout_create_an_order_with_server_total(): void
    {
        $user = User::factory()->create();
        $category = $user->categories()->create([
            'name' => 'Decoración',
            'description' => 'Objetos para casa',
        ]);
        $product = $user->products()->create([
            'name' => 'Jarrón',
            'description' => 'Cerámica',
            'price' => 19.99,
            'category_id' => $category->id,
        ]);
        Sanctum::actingAs($user);

        $basketId = $this->getJson('/api/basket')
            ->assertOk()
            ->json('id');
        $this->postJson('/api/basket/add', [
            'product_id' => $product->id,
            'quantity' => 2,
        ])->assertOk()->assertJsonPath('products.0.pivot.quantity', 2);

        $this->postJson('/api/payments', [
            'basket_id' => $basketId,
            'name' => 'Demo User',
            'email' => 'demo@example.test',
            'direction' => 'Calle Ejemplo 1',
            'city' => 'Ciudad Demo',
            'zip' => '00000',
            'country' => 'España',
        ])->assertCreated()->assertJsonPath('total', '39.98');

        $this->assertDatabaseHas('baskets', ['id' => $basketId, 'finished' => true]);
        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'basket_id' => $basketId,
            'total' => '39.98',
        ]);
    }

    public function test_users_cannot_read_another_users_basket(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $basket = $owner->basket()->create(['finished' => false]);
        Sanctum::actingAs($otherUser);

        $this->getJson('/api/basket/' . $basket->id)->assertNotFound();
    }

    public function test_owner_can_update_profile_and_change_password(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->patchJson('/api/users/updateProfile/' . $user->id, [
            'name' => 'Nombre actualizado',
            'email' => $user->email,
        ])->assertOk()
            ->assertJsonPath('user.name', 'Nombre actualizado');

        $this->postJson('/api/changePassword/' . $user->id, [
            'password' => 'new-password',
            'repeatPassword' => 'new-password',
        ])->assertOk();

        $this->assertTrue(password_verify('new-password', $user->fresh()->password));
    }

    public function test_regular_users_cannot_access_administrator_user_list(): void
    {
        Sanctum::actingAs(User::factory()->create(['type' => 'user']));

        $this->getJson('/api/users/all')->assertForbidden();
    }
}
