# Tienda online simulada

Proyecto de portfolio que reproduce el flujo de una tienda online. Incluye una tienda para clientes, una API propia y un panel de administración. Los pedidos se guardan en la base de datos local; no se realizan cobros reales ni se conecta con servicios externos de pago.

## Funcionalidades

- Catálogo de productos y categorías, con vista de detalle.
- Registro, inicio y cierre de sesión.
- Perfil de usuario, cesta y consulta de pedidos.
- Proceso de compra con el total calculado en el servidor.
- Panel de administración para gestionar productos, categorías, usuarios y pedidos.
- Subida y gestión de imágenes de productos.
- Protección de rutas y operaciones de administración mediante autenticación y roles.

## Tecnologías

- **Frontend:** Angular 20, TypeScript, Signals y RxJS.
- **Backend:** Laravel 12, PHP 8.2 o superior y Laravel Sanctum.
- **Base de datos local:** SQLite.

## Requisitos

- PHP 8.2 o superior y Composer.
- Node.js y npm.
- Windows PowerShell (los comandos de instalación siguientes usan PowerShell).

## Instalación y ejecución local

### 1. Preparar el backend

Desde la carpeta raíz del proyecto, abre una terminal PowerShell:

```powershell
cd backend
composer install

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}

if (-not (Test-Path database/database.sqlite)) {
    New-Item -ItemType File database/database.sqlite | Out-Null
}

if (Select-String -Path .env -Pattern '^APP_KEY=$' -Quiet) {
    php artisan key:generate
}

php artisan migrate
php artisan storage:link
```

Inicia la API:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

La API estará disponible en `http://127.0.0.1:8000/api`.

### 2. Preparar el frontend

En otra terminal PowerShell, desde la raíz del proyecto:

```powershell
cd frontend
npm install
npm start
```

Abre `http://localhost:4200` en el navegador. El frontend usa el nombre de host desde el que se abre para construir la dirección de la API. La configuración CORS inicial permite `localhost:4200` y `127.0.0.1:4200`.

## Crear una cuenta de administrador

Regístrate desde la tienda. El registro público crea una cuenta normal; no hay una cuenta de administrador ni credenciales demo preconfiguradas.

Con la API detenida o en una terminal adicional, entra en `backend` y abre Tinker:

```powershell
cd backend
php artisan tinker
```

Promueve tu cuenta sustituyendo el correo por el que usaste al registrarte:

```php
App\Models\User::where('email', 'tu-correo@example.com')->update(['type' => 'admin']);
```

Después de iniciar sesión de nuevo, el panel de administración estará disponible en `/administration`.

## Pruebas

Desde la carpeta `backend`:

```powershell
php artisan test
```

## Estructura del proyecto

```text
backend/                              API Laravel, migraciones y almacenamiento
frontend/                             Aplicación Angular
ShopLaravelAngular.postman_collection.json  Colección de peticiones de la API
```

## Alcance

La aplicación está pensada para ejecutarse en local como demostración de portfolio. SQLite y las imágenes subidas se guardan localmente y no se incluyen en Git. Para desplegarla habría que configurar el entorno, la base de datos, CORS, almacenamiento y credenciales de producción.
