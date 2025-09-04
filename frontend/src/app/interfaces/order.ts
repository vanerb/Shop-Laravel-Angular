export interface Order {
  "id": number,
  "basket_id": number,
  "total":string,
  "status": string,
  "name": string,
  "email": string,
  "direction": string,
  "city": string,
  "zip": string,
  "country": string,
  "created_at": string,
  "updated_at":string,
  "user_id": number
}

export interface CreateOrder {
  "basket_id": number,
  "total": string,
  "status":string,
  "name": string,
  "email": string,
  "direction": string,
  "city": string,
  "zip":string,
  "country": string
}
