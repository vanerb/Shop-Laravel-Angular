# Backend

API REST de la tienda, creada con Laravel 12 y Sanctum. Para el desarrollo local usa SQLite y escucha en el puerto `8000`.

## Preparar el entorno

Desde esta carpeta:

```powershell
composer install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path database/database.sqlite)) { New-Item -ItemType File database/database.sqlite }
if (Select-String -Path .env -Pattern '^APP_KEY=$' -Quiet) { php artisan key:generate }
php artisan migrate
php artisan storage:link
```

Si ya existe `.env`, conserva su `APP_KEY`; no vuelvas a generarla. Si Angular usa otra dirección, incluye su origen en `CORS_ALLOWED_ORIGINS` dentro de `.env`, separado por comas.

Inicia la API:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

La API queda en `http://127.0.0.1:8000/api`. El frontend local se ejecuta normalmente en `http://localhost:4200`.

## Funciones de la API

- Registro e inicio de sesión con tokens Bearer de Sanctum.
- Catálogo público de productos y categorías.
- Gestión autenticada de productos, categorías y cestas.
- Creación y consulta de pedidos; la cesta se finaliza al crear el pedido y el total se calcula en el servidor.
- Gestión de usuarios y pedidos reservada a cuentas `admin`.

El registro público crea cuentas `user`. Para dar permisos de administración, promueve una cuenta de confianza desde `php artisan tinker`:

```php
App\Models\User::where('email', 'tu-correo@example.com')->update(['type' => 'admin']);
```

No hay una cuenta de administrador ni credenciales de demostración preconfiguradas.
