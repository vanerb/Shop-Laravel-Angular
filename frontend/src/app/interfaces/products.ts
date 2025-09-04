export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  user_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  images: Images[]
}

export interface Images{
  "id": number,
    "path": string,
    "from": string,
    "imageable_id": number,
    "imageable_type":string,
    "created_at": string,
    "updated_at": string
}
