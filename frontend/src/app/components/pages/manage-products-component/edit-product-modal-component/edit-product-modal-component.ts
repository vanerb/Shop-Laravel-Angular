import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../../interfaces/categories';
import {CategoriesService} from '../../../../services/categories-service';
import {Images, Product} from '../../../../interfaces/products';
import { getImageUrl } from '../../../../helpers/utilities.helper';

@Component({
  selector: 'app-edit-product-modal-component',
  standalone: false,
  templateUrl: './edit-product-modal-component.html',
  styleUrl: './edit-product-modal-component.css'
})
export class EditProductModalComponent implements OnInit, AfterViewInit{
  form!: FormGroup;
  product!: Product;

  categories: Category[] = [];

  // Archivos nuevos seleccionados
  selectedImagesGallery: File[] = [];
  selectedImagesCover: File[] = [];

  // Imágenes existentes
  existingGalleryImages: Images[] = [];
  existingCoverImage: Images | null = null;

  // Imágenes eliminadas
  deletedGalleryImages: Images[] = [];
  deletedCoverImage: boolean = false;

  confirm!: (result?: any) => void;
  close!: () => void;

  constructor(
    private fb: FormBuilder,
    private readonly categoriesService: CategoriesService,
    private cd: ChangeDetectorRef,

  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category_id: ['', Validators.required],
      cover_image: [null],
      images: [null],
    });
  }

  async ngOnInit() {
    // Set form values
    this.form.patchValue({
      name: this.product?.name || '',
      description: this.product?.description || '',
      price: this.product?.price || '',
      category_id: this.product?.category_id || ''
    });

    // Separar imágenes existentes
    if (this.product?.images?.length) {
      for (const el of this.product.images) {
        if (el.from === 'gallery') {
          this.existingGalleryImages.push(el);
        } else if (el.from === 'cover') {
          this.existingCoverImage = el;
        }
      }
    }
  }

  ngAfterViewInit() {
    this.categoriesService.getAllCategoriesByUser().subscribe({
      next: (categories: Category[]) => {
        this.categories = [...categories];
        this.cd.detectChanges();
      },
      error: (err) => console.error("Error al cargar categorías", err)
    });
  }

  onCoverImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImagesCover = [input.files[0]]; // reemplaza la anterior
      if (this.existingCoverImage) {
        this.deletedCoverImage = true; // marcar portada existente como borrada
        this.existingCoverImage = null;
      }
    }
  }

  onGalleryImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImagesGallery.push(...Array.from(input.files));
    }
  }

  getImageUrl(image: Images): string {
    return getImageUrl(image)
  }

  delete(pos: number) {
    const image = this.product.images[pos];

    if (image.from === 'gallery') {
      const idx = this.existingGalleryImages.findIndex(e => e.id === image.id);
      if (idx > -1) {
        this.deletedGalleryImages.push(this.existingGalleryImages[idx]);
        this.existingGalleryImages.splice(idx, 1);
      } else {
        this.selectedImagesGallery.splice(pos, 1);
      }
    } else if (image.from === 'cover') {
      if (this.existingCoverImage) {
        this.deletedCoverImage = true;
        this.existingCoverImage = null;
      } else {
        this.selectedImagesCover = [];
      }
    }

    this.product.images.splice(pos, 1);
  }

  async urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  update() {
    if (!this.form.valid) return;

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('price', this.form.get('price')?.value);
    formData.append('category_id', this.form.get('category_id')?.value);

    // Subir nueva portada
    if (this.selectedImagesCover.length > 0) {
      formData.append('cover_image', this.selectedImagesCover[0], this.selectedImagesCover[0].name);
    }

    // Subir nuevas imágenes de galería
    this.selectedImagesGallery.forEach(img => formData.append('images[]', img));

    // IDs de imágenes existentes que se mantienen
    this.existingGalleryImages.forEach(img => formData.append('existing_images[]', img.id.toString()));
    if (this.existingCoverImage) {
      formData.append('existing_cover_image', this.existingCoverImage.id.toString());
    }

    // Imágenes eliminadas
    this.deletedGalleryImages.forEach(img => formData.append('deleted_images[]', img.id.toString()));
    if (this.deletedCoverImage) {
      formData.append('deleted_cover_image', '1');
    }

    this.confirm(formData);
  }
}
