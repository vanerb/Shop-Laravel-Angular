import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

type AnyRecord = any;
const KEY = 'shop-demo-state-v1';
const iso = () => new Date().toISOString();

const initialCategories = [
  { id: 1, name: 'Informática', description: 'Ordenadores y accesorios', created_at: iso(), updated_at: iso() },
  { id: 2, name: 'Periféricos', description: 'Teclados, ratones y accesorios', created_at: iso(), updated_at: iso() },
  { id: 3, name: 'Audio', description: 'Auriculares y sonido', created_at: iso(), updated_at: iso() },
  { id: 4, name: 'Gaming', description: 'Productos para jugar', created_at: iso(), updated_at: iso() },
  { id: 5, name: 'Móviles', description: 'Telefonía y complementos', created_at: iso(), updated_at: iso() },
  { id: 6, name: 'Hogar', description: 'Tecnología para el hogar', created_at: iso(), updated_at: iso() }
];

const productNames = [
  ['Teclado mecánico RGB', 'Teclado mecánico con iluminación RGB y switches táctiles.', '69.99', 2],
  ['Ratón gaming inalámbrico', 'Ratón inalámbrico de baja latencia y sensor de precisión.', '49.95', 4],
  ['Auriculares Bluetooth', 'Auriculares inalámbricos con sonido envolvente y micrófono.', '79.90', 3],
  ['Monitor IPS 27 pulgadas', 'Monitor IPS QHD de 27 pulgadas con alta tasa de refresco.', '229.00', 1],
  ['SSD NVMe 1 TB', 'Unidad SSD NVMe de alta velocidad para sobremesa y portátil.', '89.99', 1],
  ['Webcam Full HD', 'Cámara web Full HD ideal para videollamadas y streaming.', '39.90', 2],
  ['Alfombrilla XL', 'Alfombrilla de gran tamaño con base antideslizante.', '19.95', 4],
  ['Micrófono USB', 'Micrófono USB plug and play para grabación y streaming.', '59.99', 3],
  ['Hub USB-C 7 en 1', 'Hub multipuerto USB-C con HDMI, USB y lector de tarjetas.', '34.90', 1],
  ['Mando inalámbrico', 'Mando inalámbrico compatible con PC y dispositivos móviles.', '44.95', 4],
  ['Soporte para portátil', 'Soporte ergonómico ajustable de aluminio.', '27.50', 1],
  ['Cargador rápido USB-C', 'Cargador compacto con carga rápida y protección inteligente.', '24.99', 5],
  ['Altavoz Bluetooth', 'Altavoz portátil con sonido potente y batería de larga duración.', '54.90', 3],
  ['Funda para móvil', 'Funda protectora flexible con acabado antideslizante.', '14.95', 5],
  ['Lámpara LED de escritorio', 'Lámpara LED regulable para escritorio y zona de estudio.', '32.90', 6],
  ['Memoria USB 128 GB', 'Memoria USB 3.2 de alta velocidad y diseño compacto.', '16.99', 1],
  ['Tarjeta gráfica', 'Tarjeta gráfica para gaming y creación de contenido.', '399.00', 1],
  ['Base refrigeradora', 'Base refrigeradora para portátiles con ventiladores silenciosos.', '29.95', 1],
  ['Ratón ergonómico', 'Ratón ergonómico para trabajar cómodamente durante horas.', '25.90', 2],
  ['Auriculares gaming', 'Auriculares gaming con micrófono abatible y controles integrados.', '64.90', 4],
  ['Power bank 20000 mAh', 'Batería externa de gran capacidad con carga rápida.', '39.99', 5],
  ['Teclado compacto', 'Teclado compacto para escritorios minimalistas.', '45.00', 2],
  ['Cable USB-C', 'Cable USB-C reforzado compatible con carga y transferencia.', '9.99', 5],
  ['Disco duro externo 2 TB', 'Almacenamiento externo portátil para copias de seguridad.', '74.90', 1]
];

const initialProducts = productNames.map((p, i) => ({
  id: i + 1, name: p[0], description: p[1], price: p[2], user_id: 1,
  category_id: p[3], created_at: iso(), updated_at: iso(),
  category: initialCategories.find(c => c.id === p[3])!,
  images: [{ id: i + 1, path: '', from: 'cover', imageable_id: i + 1, imageable_type: 'App\\Models\\Product', created_at: iso(), updated_at: iso() }],
  pivot: { basket_id: 1, product_id: i + 1, quantity: 1, created_at: iso(), updated_at: iso() }
}));

const initialUsers = [
  { id: 1, name: 'Vanesa', subname: 'Demo', email: 'demo@shop.local', email_verified_at: null, created_at: iso(), updated_at: iso(), phone: '600000000', prefix: '+34', token: 'shop-demo-token', active: 1, type: 'user', images: [] },
  { id: 2, name: 'Administración', subname: 'Demo', email: 'admin@shop.local', email_verified_at: null, created_at: iso(), updated_at: iso(), phone: '600000001', prefix: '+34', token: 'shop-demo-admin-token', active: 1, type: 'admin', images: [] }
];

function loadState(): AnyRecord {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    categories: initialCategories, products: initialProducts, users: initialUsers,
    baskets: [{ id: 1, user_id: 1, finished: 0, created_at: iso(), updated_at: iso(), products: [] }],
    orders: [], nextProductId: 25, nextCategoryId: 7, nextUserId: 3, nextOrderId: 1
  };
}
function saveState(state: AnyRecord) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
function currentUser(state: AnyRecord): AnyRecord {
  const token = localStorage.getItem('token');
  return state.users.find((u: AnyRecord) => u.token === token) || state.users[0];
}
function response(body: any, status = 200) { return of(new HttpResponse({ status, body })); }
function fail(message: string, status = 400) {
  return throwError(() => new HttpErrorResponse({ status, error: { message, errors: { email: [message] } } }));
}
function value(body: any, key: string): string {
  return String(body instanceof FormData ? body.get(key) ?? '' : body?.[key] ?? '');
}
function makeProduct(state: AnyRecord, body: any, id: number): AnyRecord {
  const categoryId = Number(value(body, 'category_id')) || state.categories[0]?.id || 1;
  const old = state.products.find((p: AnyRecord) => p.id === id);
  return {
    ...old, id, name: value(body, 'name') || old?.name || 'Nuevo producto',
    description: value(body, 'description') || old?.description || 'Producto de demostración.',
    price: value(body, 'price') || old?.price || '19.99', user_id: old?.user_id || currentUser(state).id,
    category_id: categoryId, category: state.categories.find((c: AnyRecord) => c.id === categoryId) || state.categories[0],
    images: old?.images?.length ? old.images : [{ id, path: '', from: 'cover', imageable_id: id, imageable_type: 'App\\Models\\Product', created_at: iso(), updated_at: iso() }],
    created_at: old?.created_at || iso(), updated_at: iso(),
    pivot: old?.pivot || { basket_id: 1, product_id: id, quantity: 1, created_at: iso(), updated_at: iso() }
  };
}
function basketFor(state: AnyRecord, userId = currentUser(state).id): AnyRecord {
  let basket = state.baskets.find((b: AnyRecord) => b.user_id === userId && b.finished === 0);
  if (!basket) {
    basket = { id: Math.max(0, ...state.baskets.map((b: AnyRecord) => b.id)) + 1, user_id: userId, finished: 0, created_at: iso(), updated_at: iso(), products: [] };
    state.baskets.push(basket);
  }
  basket.products = basket.products.map((line: AnyRecord) => {
    const product = state.products.find((p: AnyRecord) => p.id === line.id);
    return product ? { ...product, pivot: { ...line.pivot, basket_id: basket.id } } : null;
  }).filter(Boolean);
  return basket;
}
function syncBasketProduct(state: AnyRecord, basket: AnyRecord, productId: number, quantity: number) {
  const product = state.products.find((p: AnyRecord) => p.id === productId);
  if (!product) return;
  const existing = basket.products.find((p: AnyRecord) => p.id === productId);
  if (existing) existing.pivot.quantity = Math.max(1, existing.pivot.quantity + quantity);
  else basket.products.push({ ...product, pivot: { basket_id: basket.id, product_id: productId, quantity: Math.max(1, quantity), created_at: iso(), updated_at: iso() } });
  basket.updated_at = iso();
}

export const shopDemoInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/')) return next(req);
  const url = new URL(req.url, typeof location !== 'undefined' ? location.origin : 'http://localhost');
  const path = url.pathname.slice(url.pathname.indexOf('/api/') + 4).replace(/^\//, '');
  const method = req.method.toUpperCase();
  const state = loadState();
  const user = currentUser(state);
  const admin = user.type === 'admin';
  const auth = !!localStorage.getItem('token');

  if (method === 'GET' && path === 'products') return response(state.products.map((p: AnyRecord) => ({ ...p, pivot: { ...p.pivot, quantity: 1 } })));
  if (method === 'GET' && path === 'categories/all') return response(state.categories);
  if (method === 'POST' && path === 'login') {
    const email = value(req.body, 'email').toLowerCase();
    if (!email || !value(req.body, 'password')) return fail('Introduce un correo y una contraseña.', 422);
    const selected = state.users.find((u: AnyRecord) => u.email.toLowerCase() === email)
      || { ...state.users[0], id: state.nextUserId++, name: email.split('@')[0], email, type: email.includes('admin') ? 'admin' : 'user', token: 'shop-demo-token-' + Date.now() };
    if (!state.users.some((u: AnyRecord) => u.email.toLowerCase() === email)) state.users.push(selected);
    localStorage.setItem('token', selected.token);
    localStorage.setItem('type', selected.type);
    saveState(state);
    return response({ access_token: selected.token, type: selected.type });
  }
  if (method === 'POST' && path === 'register') {
    const email = value(req.body, 'email').toLowerCase();
    if (!email) return fail('Introduce un correo electrónico válido.', 422);
    if (state.users.some((u: AnyRecord) => u.email.toLowerCase() === email)) return fail('Este correo ya está registrado.', 422);
    const created = { id: state.nextUserId++, name: value(req.body, 'name') || 'Usuario', subname: value(req.body, 'subname'), email, phone: value(req.body, 'phone'), prefix: value(req.body, 'prefix'), email_verified_at: null, created_at: iso(), updated_at: iso(), token: 'shop-demo-user-' + Date.now(), active: 1, type: 'user', images: [] };
    state.users.push(created); saveState(state);
    return response({ message: 'Cuenta creada correctamente.', user: created }, 201);
  }
  if (method === 'GET' && path === 'user') return auth ? response(user) : fail('No has iniciado sesión.', 401);
  if (method === 'POST' && path === 'logout') { localStorage.removeItem('token'); localStorage.removeItem('type'); return response({ message: 'Sesión cerrada.' }); }

  if (method === 'GET' && path === 'basket') {
    if (!auth) return fail('Inicia sesión para ver la cesta.', 401);
    const basket = basketFor(state); saveState(state); return response(basket);
  }
  const basketIdMatch = path.match(/^basket\/(\d+)$/);
  if (method === 'GET' && basketIdMatch) {
    const basket = state.baskets.find((b: AnyRecord) => b.id === Number(basketIdMatch[1])) || basketFor(state);
    saveState(state); return response(basket);
  }
  if (method === 'POST' && path === 'basket/add') {
    if (!auth) return fail('Inicia sesión para añadir productos.', 401);
    const basket = basketFor(state);
    syncBasketProduct(state, basket, Number(value(req.body, 'product_id')), Number(value(req.body, 'quantity')) || 1);
    saveState(state); return response(basket);
  }
  const removeBasket = path.match(/^basket\/remove\/(\d+)$/);
  if (method === 'DELETE' && removeBasket) {
    const basket = basketFor(state); basket.products = basket.products.filter((p: AnyRecord) => p.id !== Number(removeBasket[1]));
    saveState(state); return response(basket);
  }
  if (method === 'DELETE' && path === 'basket/clear') { const basket = basketFor(state); basket.products = []; saveState(state); return response(basket); }

  if (method === 'GET' && path === 'payments') return response(state.orders.filter((o: AnyRecord) => o.user_id === user.id));
  if (method === 'GET' && path === 'payments/all') return response(state.orders);
  if (method === 'POST' && path === 'payments') {
    if (!auth) return fail('Inicia sesión para realizar un pedido.', 401);
    const basket = state.baskets.find((b: AnyRecord) => b.id === Number(value(req.body, 'basket_id'))) || basketFor(state);
    const total = basket.products.reduce((sum: number, p: AnyRecord) => sum + Number(p.price) * Number(p.pivot.quantity || 1), 0);
    const order = { id: state.nextOrderId++, basket_id: basket.id, total: total.toFixed(2), status: 'Pendiente', name: value(req.body, 'name'), email: value(req.body, 'email'), direction: value(req.body, 'direction'), city: value(req.body, 'city'), zip: value(req.body, 'zip'), country: value(req.body, 'country'), created_at: iso(), updated_at: iso(), user_id: user.id };
    state.orders.push(order); basket.finished = 1;
    state.baskets.push({ id: Math.max(0, ...state.baskets.map((b: AnyRecord) => b.id)) + 1, user_id: user.id, finished: 0, created_at: iso(), updated_at: iso(), products: [] });
    saveState(state); return response(order, 201);
  }
  const paymentId = path.match(/^payments\/(\d+)$/);
  if (paymentId && method === 'PATCH') {
    const order = state.orders.find((o: AnyRecord) => o.id === Number(paymentId[1]));
    if (order) order.status = value(req.body, 'status') || order.status;
    saveState(state); return response(order || {});
  }
  if (paymentId && method === 'DELETE') {
    state.orders = state.orders.filter((o: AnyRecord) => o.id !== Number(paymentId[1])); saveState(state); return response({ success: true });
  }

  if (method === 'GET' && path === 'categories') return response(state.categories);
  if (method === 'POST' && path === 'categories') {
    const category = { id: state.nextCategoryId++, name: value(req.body, 'name') || 'Nueva categoría', description: value(req.body, 'description'), created_at: iso(), updated_at: iso() };
    state.categories.push(category); saveState(state); return response(category, 201);
  }
  const categoryId = path.match(/^categories\/(\d+)$/);
  if (categoryId && method === 'POST') {
    const cat = state.categories.find((c: AnyRecord) => c.id === Number(categoryId[1]));
    if (cat) { cat.name = value(req.body, 'name') || cat.name; cat.description = value(req.body, 'description') || cat.description; cat.updated_at = iso(); }
    state.products.forEach((p: AnyRecord) => { if (p.category_id === Number(categoryId[1])) p.category = cat; });
    saveState(state); return response(cat || {});
  }
  if (categoryId && method === 'DELETE') {
    state.categories = state.categories.filter((c: AnyRecord) => c.id !== Number(categoryId[1]));
    saveState(state); return response({ success: true });
  }

  if (method === 'GET' && path === 'productsByUser') return response(state.products.filter((p: AnyRecord) => admin || p.user_id === user.id));
  const productId = path.match(/^products\/(\d+)$/);
  if (method === 'POST' && path === 'products') {
    const product = makeProduct(state, req.body, state.nextProductId++); state.products.unshift(product); saveState(state); return response(product, 201);
  }
  if (productId && method === 'POST') {
    const product = makeProduct(state, req.body, Number(productId[1]));
    state.products = state.products.map((p: AnyRecord) => p.id === product.id ? product : p); saveState(state); return response(product);
  }
  if (productId && method === 'DELETE') {
    state.products = state.products.filter((p: AnyRecord) => p.id !== Number(productId[1]));
    state.baskets.forEach((b: AnyRecord) => b.products = b.products.filter((p: AnyRecord) => p.id !== Number(productId[1])));
    saveState(state); return response({ success: true });
  }

  if (method === 'GET' && path === 'users/all') return response(state.users);
  if (method === 'POST' && path === 'users') {
    const created = { id: state.nextUserId++, name: value(req.body,'name') || 'Usuario', subname: value(req.body,'subname'), email: value(req.body,'email'), phone: value(req.body,'phone'), prefix: value(req.body,'prefix'), type: value(req.body,'type') || 'user', active: 1, created_at: iso(), updated_at: iso(), token: 'shop-demo-user-' + Date.now(), images: [] };
    state.users.push(created); saveState(state); return response(created, 201);
  }
  const userId = path.match(/^users\/(\d+)$/);
  const updateProfile = path.match(/^users\/updateProfile\/(\d+)$/);
  if (updateProfile && method === 'POST') {
    const target = state.users.find((u: AnyRecord) => u.id === Number(updateProfile[1]));
    if (target) { target.name = value(req.body,'name') || target.name; target.subname = value(req.body,'subname') || target.subname; target.email = value(req.body,'email') || target.email; target.phone = value(req.body,'phone') || target.phone; target.prefix = value(req.body,'prefix') || target.prefix; target.updated_at = iso(); }
    saveState(state); return response(target || {});
  }
  if (userId && method === 'DELETE') { state.users = state.users.filter((u: AnyRecord) => u.id !== Number(userId[1])); saveState(state); return response({ success: true }); }
  if (method === 'POST' && /^changePassword\/\d+$/.test(path)) return response({ message: 'Contraseña de demostración actualizada.' });

  return next(req);
};
