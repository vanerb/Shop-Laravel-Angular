// src/app/helpers/api.helper.ts
import {Images, Product} from '../interfaces/products';
import {API_ORIGIN} from '../services/api-base-url';

export function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function transformDate(isoDate: string) {
  const date = new Date(isoDate);
  const formatted = date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC", // o tu zona horaria local
  });

  return formatted
}

export function calculateTotal(items: Product[]){
  let total = 0
  items.forEach(el=>{
    total += Number.parseFloat(el.price) * el.pivot.quantity
  })

  return total.toFixed(2)
}

export function getImageUrl(image: Images | undefined) {
  return image?.path ? `${API_ORIGIN}/image/${image.path.replace(/^images\//, '')}` : '/Shop-Laravel-Angular/assets/product-placeholder.svg';
}

export function getProductCoverImage(images: Images[] | undefined): Images | undefined {
  if (!images?.length) return undefined;
  return images.find(image => image.from === 'cover') ?? [...images].sort((a, b) => a.id - b.id)[0];
}


