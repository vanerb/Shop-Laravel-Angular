import { Injectable } from '@angular/core';
import {Images, Product} from '../interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  transformDate(isoDate: string) {
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


  calculateTotal(items: Product[]){
    let total = 0
    items.forEach(el=>{
      total += Number.parseFloat(el.price) * el.pivot.quantity
    })

    return total.toFixed(2)
  }



  getImageUrl(image: Images | undefined) {
    return image ? `http://localhost:8000/image/${image.path.replace(/^images\//, '')}` : 'http://localhost:8000/storage/general/no_image.jpg';
  }
}
