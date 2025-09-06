import {Product} from './products';

export interface Basket {
  "id": number,
  "user_id": number,
  "finished": number,
  "created_at":string,
  "updated_at": string,
  "products": Product[]
}

export interface AddProductBasket{
  "product_id": number,
  "quantity": number
}
