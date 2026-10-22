import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // La sesión vive en localStorage, que no está disponible durante el renderizado SSR.
  // Renderizar estas rutas en el cliente permite que los guards comprueben el token real.
  { path: 'basket', renderMode: RenderMode.Client },
  { path: 'admin-products', renderMode: RenderMode.Client },
  { path: 'admin-categories', renderMode: RenderMode.Client },
  { path: 'admin-users', renderMode: RenderMode.Client },
  { path: 'admin-orders', renderMode: RenderMode.Client },
  { path: 'my-orders', renderMode: RenderMode.Client },
  { path: 'process-order/:id', renderMode: RenderMode.Client },
  { path: 'administration', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  { path: 'contact', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
