import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * API simulada para la demo estática (GitHub Pages): las peticiones a /api/ se resuelven en el
 * navegador imitando a los controladores de Laravel y los datos se guardan en localStorage.
 */

type Row = any;

const KEY = 'shop-demo-state-v2';
export const DEMO_PASSWORD = 'Demo1234';
export const DEMO_ACCOUNTS = [
  { email: 'cliente@shop.demo', role: 'cliente' },
  { email: 'admin@shop.demo', role: 'administración' }
];

class ApiFail {
  constructor(readonly status: number, readonly body: Row) {}
}
const fail = (status: number, message: string, field?: string): never => {
  throw new ApiFail(status, field ? { message, errors: { [field]: [message] } } : { message });
};

const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const now = () => new Date().toISOString();

const palette: Record<number, [string, string]> = {
  1: ['#ede9fe', '#6d28d9'], 2: ['#e0f2fe', '#0369a1'], 3: ['#fce7f3', '#be185d'],
  4: ['#dcfce7', '#15803d'], 5: ['#fef3c7', '#b45309'], 6: ['#ffedd5', '#c2410c']
};

/** Portada SVG generada para cada producto de muestra (no hay ficheros que servir). */
function coverSvg(name: string, categoryId: number): string {
  const [bg, fg] = palette[categoryId] ?? palette[1];
  const words = name.split(' ');
  const lines = [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')];
  const text = lines.filter(Boolean).map((line, i) =>
    `<text x="40" y="${300 + i * 44}" font-family="Arial,sans-serif" font-size="36" font-weight="700" fill="${fg}">${line}</text>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">` +
    `<rect width="600" height="600" fill="${bg}"/><circle cx="460" cy="150" r="110" fill="${fg}" opacity=".14"/>` +
    `<circle cx="460" cy="150" r="54" fill="${fg}" opacity=".3"/>${text}` +
    `<text x="40" y="540" font-family="Arial,sans-serif" font-size="18" letter-spacing="4" fill="${fg}" opacity=".7">NOVA · DEMO</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function seed(): Row {
  const categories = [
    ['Informática', 'Ordenadores y accesorios'],
    ['Periféricos', 'Teclados, ratones y accesorios'],
    ['Audio', 'Auriculares y sonido'],
    ['Gaming', 'Productos para jugar'],
    ['Móviles', 'Telefonía y complementos'],
    ['Hogar', 'Tecnología para el hogar']
  ].map(([name, description], i) => ({ id: i + 1, name, description, created_at: daysAgo(60), updated_at: daysAgo(60) }));

  const products: Row[] = [
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
  ].map(([name, description, price, category_id], i) => ({
    id: i + 1, name, description, price, category_id, user_id: 2,
    created_at: daysAgo(40 - i), updated_at: daysAgo(40 - i)
  }));

  const images = products.map(p => ({
    id: p.id, path: coverSvg(p.name, p.category_id), from: 'cover', imageable_id: p.id,
    imageable_type: 'App\\Models\\Product', created_at: p.created_at, updated_at: p.created_at
  }));

  const users = [
    { id: 1, name: 'Lucía', subname: 'Cliente', email: DEMO_ACCOUNTS[0].email, phone: '600000000', prefix: '34', type: 'user' },
    { id: 2, name: 'Admin', subname: 'Nova', email: DEMO_ACCOUNTS[1].email, phone: '600000001', prefix: '34', type: 'admin' },
    { id: 3, name: 'Marcos', subname: 'Ruiz', email: 'marcos@shop.demo', phone: '600000002', prefix: '34', type: 'user' }
  ].map(u => ({ ...u, password: DEMO_PASSWORD, token: null, active: 1, email_verified_at: null, created_at: daysAgo(50), updated_at: daysAgo(50) }));

  const line = (product_id: number, quantity: number) => ({ product_id, quantity, created_at: daysAgo(10), updated_at: daysAgo(10) });
  const baskets = [
    { id: 1, user_id: 1, finished: 1, created_at: daysAgo(12), updated_at: daysAgo(12), lines: [line(1, 1), line(3, 1)] },
    { id: 2, user_id: 3, finished: 1, created_at: daysAgo(6), updated_at: daysAgo(6), lines: [line(4, 1), line(9, 2)] },
    { id: 3, user_id: 1, finished: 0, created_at: daysAgo(2), updated_at: daysAgo(2), lines: [line(13, 1)] }
  ];
  const address = { direction: 'Calle Mayor 12', city: 'Valencia', zip: '46001', country: 'España' };
  const payments = [
    { id: 1, basket_id: 1, user_id: 1, total: '149.89', status: 'completed', name: 'Lucía Cliente', email: DEMO_ACCOUNTS[0].email, ...address, created_at: daysAgo(12), updated_at: daysAgo(9) },
    { id: 2, basket_id: 2, user_id: 3, total: '298.80', status: 'processing', name: 'Marcos Ruiz', email: 'marcos@shop.demo', ...address, city: 'Madrid', zip: '28001', created_at: daysAgo(6), updated_at: daysAgo(5) }
  ];

  return { categories, products, images, users, baskets, payments, seq: { category: 7, product: 25, image: 25, user: 4, basket: 4, payment: 3 } };
}

function load(): Row {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seed();
}
function save(db: Row): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    fail(507, 'No queda espacio en el navegador para guardar la demo. Usa «Restablecer datos» o imágenes más pequeñas.');
  }
}

/** Vuelve a los datos de muestra originales y cierra la sesión de la demo. */
export function resetDemoData(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('type');
  } catch {}
}

const readFile = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

interface Req { method: string; path: string; body: Row; files: Record<string, File[]>; token: string | null; }

class ShopDemoApi {
  constructor(private db: Row) {}

  private user(req: Req): Row | undefined {
    return req.token ? this.db.users.find((u: Row) => u.token === req.token) : undefined;
  }
  private auth(req: Req): Row {
    return this.user(req) ?? fail(401, 'Unauthenticated.');
  }
  private admin(req: Req): Row {
    const user = this.auth(req);
    if (user.type !== 'admin') fail(403, 'No tienes permiso para realizar esta acción.');
    return user;
  }

  private imagesOf(type: string, id: number, from?: string): Row[] {
    return this.db.images.filter((i: Row) => i.imageable_type === type && i.imageable_id === id && (!from || i.from === from));
  }
  private async addImage(type: string, id: number, from: string, file: File): Promise<void> {
    if (!file.type.startsWith('image/')) fail(422, 'El archivo debe ser una imagen.', 'images');
    if (file.size > 1.5 * 1024 * 1024) fail(422, 'En la demo, cada imagen debe ocupar menos de 1,5 MB.', 'images');
    this.db.images.push({ id: this.db.seq.image++, path: await readFile(file), from, imageable_id: id, imageable_type: type, created_at: now(), updated_at: now() });
  }
  private removeImages(ids: number[]): void {
    this.db.images = this.db.images.filter((i: Row) => !ids.includes(i.id));
  }

  private category(id: number): Row | undefined {
    return this.db.categories.find((c: Row) => c.id === id);
  }
  private product(p: Row): Row {
    return {
      ...p, category: this.category(p.category_id) ?? null, images: this.imagesOf('App\\Models\\Product', p.id),
      pivot: { basket_id: 0, product_id: p.id, quantity: 1, created_at: p.created_at, updated_at: p.updated_at }
    };
  }
  private publicUser(u: Row): Row {
    const { password, token, ...rest } = u;
    return { ...rest, images: this.imagesOf('App\\Models\\User', u.id) };
  }
  private basket(b: Row): Row {
    const { lines, ...rest } = b;
    const products = lines.map((l: Row) => {
      const p = this.db.products.find((x: Row) => x.id === l.product_id);
      return p ? { ...this.product(p), pivot: { basket_id: b.id, ...l } } : null;
    }).filter(Boolean);
    return { ...rest, products };
  }
  private activeBasket(user: Row, create = true): Row | undefined {
    let basket = this.db.baskets.find((b: Row) => b.user_id === user.id && !b.finished);
    if (!basket && create) {
      basket = { id: this.db.seq.basket++, user_id: user.id, finished: 0, created_at: now(), updated_at: now(), lines: [] };
      this.db.baskets.push(basket);
    }
    return basket;
  }
  private required(body: Row, fields: string[]): void {
    for (const f of fields) if (!String(body[f] ?? '').trim()) fail(422, `El campo ${f} es obligatorio.`, f);
  }
  private uniqueEmail(email: string, exceptId?: number): void {
    if (!/^\S+@\S+\.\S+$/.test(email)) fail(422, 'Introduce un correo electrónico válido.', 'email');
    if (this.db.users.some((u: Row) => u.email.toLowerCase() === email.toLowerCase() && u.id !== exceptId)) fail(422, 'Este correo ya está registrado.', 'email');
  }

  async handle(req: Req): Promise<{ status: number; body: Row }> {
    const { method, path, body, files } = req;
    const ok = (data: Row, status = 200) => ({ status, body: data });
    let m: RegExpMatchArray | null;

    // Autenticación
    if (method === 'POST' && path === 'login') {
      const user = this.db.users.find((u: Row) => u.email.toLowerCase() === String(body.email ?? '').trim().toLowerCase());
      if (!user || user.password !== body.password) fail(422, 'Las credenciales no son correctas.', 'email');
      if (!user.active) fail(403, 'Tu cuenta está desactivada.', 'email');
      user.token = 'demo-' + user.id + '-' + Date.now().toString(36);
      return ok({ access_token: user.token, type: user.type });
    }
    if (method === 'POST' && path === 'register') {
      this.required(body, ['name', 'email', 'password']);
      this.uniqueEmail(body.email);
      if (String(body.password).length < 8) fail(422, 'La contraseña debe tener al menos 8 caracteres.', 'password');
      const user = { id: this.db.seq.user++, name: body.name, subname: body.subname ?? '', email: body.email, phone: body.phone ?? '', prefix: body.prefix ?? '', type: 'user', password: body.password, token: null, active: 1, email_verified_at: null, created_at: now(), updated_at: now() };
      this.db.users.push(user);
      if (files['profile_photo']?.[0]) await this.addImage('App\\Models\\User', user.id, 'profile_image', files['profile_photo'][0]);
      return ok({ message: 'Usuario registrado correctamente', user: this.publicUser(user) }, 201);
    }
    if (method === 'GET' && path === 'user') return ok(this.publicUser(this.auth(req)));
    if (method === 'POST' && path === 'logout') {
      const user = this.user(req);
      if (user) user.token = null;
      return ok({ message: 'Sesión cerrada' });
    }
    if (method === 'POST' && (m = path.match(/^changePassword\/(\d+)$/))) {
      const user = this.auth(req);
      if (user.id !== +m[1] && user.type !== 'admin') fail(403, 'No tienes permiso para realizar esta acción.');
      if (String(body.password ?? '').length < 8) fail(422, 'La contraseña debe tener al menos 8 caracteres.', 'password');
      if (body.password !== body.repeatPassword) fail(422, 'Las contraseñas no coinciden.', 'repeatPassword');
      this.db.users.find((u: Row) => u.id === +m![1]).password = body.password;
      return ok({ message: 'Contraseña actualizada correctamente' });
    }

    // Catálogo
    if (method === 'GET' && path === 'products') return ok([...this.db.products].reverse().map((p: Row) => this.product(p)));
    if (method === 'GET' && (path === 'categories/all' || path === 'categories')) return ok(this.db.categories);

    // Cesta y pedidos
    if (method === 'GET' && path === 'basket') return ok(this.basket(this.activeBasket(this.auth(req))));
    if (method === 'GET' && (m = path.match(/^basket\/(\d+)$/))) {
      const user = this.auth(req);
      const basket = this.db.baskets.find((b: Row) => b.id === +m![1] && (b.user_id === user.id || user.type === 'admin'));
      return basket ? ok(this.basket(basket)) : fail(404, 'Cesta no encontrada.');
    }
    if (method === 'POST' && path === 'basket/add') {
      const basket = this.activeBasket(this.auth(req));
      const productId = Number(body.product_id);
      if (!this.db.products.some((p: Row) => p.id === productId)) fail(422, 'El producto no existe.', 'product_id');
      const quantity = Math.min(999, Math.max(1, Number(body.quantity) || 1));
      const line = basket.lines.find((l: Row) => l.product_id === productId);
      if (line) { line.quantity += quantity; line.updated_at = now(); }
      else basket.lines.push({ product_id: productId, quantity, created_at: now(), updated_at: now() });
      return ok(this.basket(basket));
    }
    if (method === 'DELETE' && (m = path.match(/^basket\/remove\/(\d+)$/))) {
      const basket = this.activeBasket(this.auth(req), false) ?? fail(404, 'No tienes una cesta activa.');
      const line = basket.lines.find((l: Row) => l.product_id === +m![1]);
      if (line && line.quantity > 1) { line.quantity--; line.updated_at = now(); }
      else basket.lines = basket.lines.filter((l: Row) => l.product_id !== +m![1]);
      return ok(this.basket(basket));
    }
    if (method === 'DELETE' && path === 'basket/clear') {
      const basket = this.activeBasket(this.auth(req), false);
      if (basket) basket.lines = [];
      return ok({ message: 'Cesta vaciada correctamente.' });
    }
    if (method === 'GET' && path === 'payments') {
      const user = this.auth(req);
      return ok(this.db.payments.filter((p: Row) => p.user_id === user.id).reverse());
    }
    if (method === 'GET' && path === 'payments/all') {
      this.admin(req);
      return ok([...this.db.payments].reverse().map((p: Row) => ({
        ...p, user: this.publicUser(this.db.users.find((u: Row) => u.id === p.user_id) ?? {}),
        basket: this.basket(this.db.baskets.find((b: Row) => b.id === p.basket_id) ?? { lines: [] })
      })));
    }
    if (method === 'POST' && path === 'payments') {
      const user = this.auth(req);
      this.required(body, ['basket_id', 'name', 'email', 'direction', 'city', 'zip', 'country']);
      const basket = this.db.baskets.find((b: Row) => b.id === Number(body.basket_id) && b.user_id === user.id && !b.finished) ?? fail(404, 'Cesta no encontrada.');
      if (!basket.lines.length) fail(422, 'No puedes completar una cesta vacía.');
      const total = this.basket(basket).products.reduce((sum: number, p: Row) => sum + Number(p.price) * p.pivot.quantity, 0);
      const payment = {
        id: this.db.seq.payment++, basket_id: basket.id, user_id: user.id, total: total.toFixed(2), status: 'pending',
        name: body.name, email: body.email, direction: body.direction, city: body.city, zip: body.zip, country: body.country,
        created_at: now(), updated_at: now()
      };
      this.db.payments.push(payment);
      basket.finished = 1;
      return ok(payment, 201);
    }
    if ((m = path.match(/^payments\/(\d+)$/))) {
      this.admin(req);
      const payment = this.db.payments.find((p: Row) => p.id === +m![1]) ?? fail(404, 'Pedido no encontrado.');
      if (method === 'PATCH') {
        if (!['pending', 'processing', 'completed', 'cancelled'].includes(body.status)) fail(422, 'Estado no válido.', 'status');
        payment.status = body.status;
        payment.updated_at = now();
        return ok(payment);
      }
      if (method === 'DELETE') {
        this.db.payments = this.db.payments.filter((p: Row) => p !== payment);
        return ok({ message: 'Pedido eliminado' });
      }
    }

    // Administración: categorías
    if (method === 'POST' && path === 'categories') {
      this.admin(req);
      this.required(body, ['name']);
      const category = { id: this.db.seq.category++, name: body.name, description: body.description ?? '', created_at: now(), updated_at: now() };
      this.db.categories.push(category);
      return ok(category, 201);
    }
    if ((m = path.match(/^categories\/(\d+)$/))) {
      this.admin(req);
      const category = this.category(+m[1]) ?? fail(404, 'Categoría no encontrada.');
      if (method === 'POST') {
        this.required(body, ['name']);
        Object.assign(category, { name: body.name, description: body.description ?? '', updated_at: now() });
        return ok(category);
      }
      if (method === 'DELETE') {
        if (this.db.products.some((p: Row) => p.category_id === category.id)) fail(422, 'No puedes eliminar una categoría con productos asociados.');
        this.db.categories = this.db.categories.filter((c: Row) => c !== category);
        return ok({ message: 'Categoría eliminada' });
      }
    }

    // Administración: productos
    if (method === 'GET' && path === 'productsByUser') {
      const user = this.auth(req);
      return ok([...this.db.products].reverse().filter((p: Row) => user.type === 'admin' || p.user_id === user.id).map((p: Row) => this.product(p)));
    }
    if (method === 'POST' && path === 'products') {
      const user = this.admin(req);
      this.required(body, ['name', 'description', 'price', 'category_id']);
      const product = { id: this.db.seq.product++, name: body.name, description: body.description, price: Number(body.price).toFixed(2), category_id: Number(body.category_id), user_id: user.id, created_at: now(), updated_at: now() };
      if (files['cover_image']?.[0]) await this.addImage('App\\Models\\Product', product.id, 'cover', files['cover_image'][0]);
      for (const file of files['images[]'] ?? []) await this.addImage('App\\Models\\Product', product.id, 'gallery', file);
      this.db.products.push(product);
      return ok(this.product(product), 201);
    }
    if ((m = path.match(/^products\/(\d+)$/))) {
      this.admin(req);
      const product = this.db.products.find((p: Row) => p.id === +m![1]) ?? fail(404, 'Producto no encontrado.');
      const type = 'App\\Models\\Product';
      if (method === 'POST') {
        this.required(body, ['name', 'description', 'price', 'category_id']);
        Object.assign(product, { name: body.name, description: body.description, price: Number(body.price).toFixed(2), category_id: Number(body.category_id), updated_at: now() });
        if (files['cover_image']?.[0] || body.deleted_cover_image === '1') {
          this.removeImages(this.imagesOf(type, product.id, 'cover').map(i => i.id));
          if (files['cover_image']?.[0]) await this.addImage(type, product.id, 'cover', files['cover_image'][0]);
        }
        const deleted = [].concat(body['deleted_images[]'] ?? []).map(Number);
        this.removeImages(this.imagesOf(type, product.id, 'gallery').filter(i => deleted.includes(i.id)).map(i => i.id));
        for (const file of files['images[]'] ?? []) await this.addImage(type, product.id, 'gallery', file);
        return ok(this.product(product));
      }
      if (method === 'DELETE') {
        this.removeImages(this.imagesOf(type, product.id).map(i => i.id));
        this.db.products = this.db.products.filter((p: Row) => p !== product);
        this.db.baskets.forEach((b: Row) => { if (!b.finished) b.lines = b.lines.filter((l: Row) => l.product_id !== product.id); });
        return ok({ message: 'Producto eliminado' });
      }
    }

    // Administración: usuarios y perfil
    if (method === 'GET' && path === 'users/all') {
      this.admin(req);
      return ok(this.db.users.map((u: Row) => this.publicUser(u)));
    }
    if (method === 'POST' && path === 'users') {
      this.admin(req);
      this.required(body, ['name', 'email', 'password']);
      this.uniqueEmail(body.email);
      const user = { id: this.db.seq.user++, name: body.name, subname: body.subname ?? '', email: body.email, phone: body.phone ?? '', prefix: body.prefix ?? '', type: body.type === 'admin' ? 'admin' : 'user', password: body.password, token: null, active: 1, email_verified_at: null, created_at: now(), updated_at: now() };
      this.db.users.push(user);
      if (files['profile_photo']?.[0]) await this.addImage('App\\Models\\User', user.id, 'profile_image', files['profile_photo'][0]);
      return ok(this.publicUser(user), 201);
    }
    if (method === 'POST' && (m = path.match(/^users\/updateProfile\/(\d+)$/))) {
      const current = this.auth(req);
      if (current.id !== +m[1] && current.type !== 'admin') fail(403, 'No tienes permiso para realizar esta acción.');
      const user = this.db.users.find((u: Row) => u.id === +m![1]) ?? fail(404, 'Usuario no encontrado.');
      this.required(body, ['name', 'email']);
      this.uniqueEmail(body.email, user.id);
      Object.assign(user, { name: body.name, subname: body.subname ?? user.subname, email: body.email, phone: body.phone ?? user.phone, prefix: body.prefix ?? user.prefix, updated_at: now() });
      if (current.type === 'admin' && (body.type === 'admin' || body.type === 'user')) user.type = body.type;
      if (body.password) user.password = body.password;
      if (files['profile_photo']?.[0] || body.deleted_profile_photo === '1') {
        this.removeImages(this.imagesOf('App\\Models\\User', user.id).map(i => i.id));
        if (files['profile_photo']?.[0]) await this.addImage('App\\Models\\User', user.id, 'profile_image', files['profile_photo'][0]);
      }
      return ok(this.publicUser(user));
    }
    if (method === 'DELETE' && (m = path.match(/^users\/(\d+)$/))) {
      const current = this.admin(req);
      if (current.id === +m[1]) fail(422, 'No puedes eliminar tu propia cuenta.');
      this.db.users = this.db.users.filter((u: Row) => u.id !== +m![1]);
      return ok({ message: 'Usuario eliminado' });
    }

    return fail(404, 'Ruta no disponible en la demo.');
  }
}

export const shopDemoInterceptor: HttpInterceptorFn = (request, next) => {
  const match = /\/api\/([^?#]*)/.exec(request.url);
  if (!match) return next(request);

  return new Observable(subscriber => {
    let cancelled = false;
    const run = async () => {
      const body: Row = {};
      const files: Record<string, File[]> = {};
      if (request.body instanceof FormData) {
        request.body.forEach((value, key) => {
          if (value instanceof File) {
            if (value.size > 0) (files[key] ??= []).push(value);
          } else if (key.endsWith('[]')) {
            (body[key] ??= []).push(value);
          } else {
            body[key] = value;
          }
        });
      } else if (request.body && typeof request.body === 'object') {
        Object.assign(body, request.body);
      }
      const header = request.headers.get('Authorization');
      const token = header?.startsWith('Bearer ') && header.slice(7) !== 'null' ? header.slice(7) : localStorage.getItem('token');
      // Latencia breve para que se vean los estados de carga, como con un servidor real.
      await new Promise(resolve => setTimeout(resolve, 150));
      const db = load();
      try {
        const result = await new ShopDemoApi(db).handle({ method: request.method.toUpperCase(), path: match[1].replace(/\/+$/, ''), body, files, token });
        if (request.method.toUpperCase() !== 'GET' || match[1] === 'basket') save(db);
        if (!cancelled) {
          subscriber.next(new HttpResponse({ status: result.status, body: result.body, url: request.url }));
          subscriber.complete();
        }
      } catch (error) {
        if (cancelled) return;
        const fault = error instanceof ApiFail ? error : new ApiFail(500, { message: 'Error del servidor.' });
        if (!(error instanceof ApiFail)) console.error('[demo]', error);
        subscriber.error(new HttpErrorResponse({ status: fault.status, error: fault.body, url: request.url, statusText: 'Error' }));
      }
    };
    void run();
    return () => { cancelled = true; };
  });
};
