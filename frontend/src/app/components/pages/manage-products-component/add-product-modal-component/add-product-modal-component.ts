import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../../interfaces/categories';
import {CategoriesService} from '../../../../services/categories-service';

@Component({
  selector: 'app-add-product-modal-component',
  standalone: false,
  templateUrl: './add-product-modal-component.html',
  styleUrl: './add-product-modal-component.css'
})
export class AddProductModalComponent implements OnInit, AfterViewInit{

  form!: FormGroup;

  categories: Category[] = []

  confirm!: (result?: any) => void;
  close!: () => void;

  constructor(private fb: FormBuilder, private  readonly categoriesService: CategoriesService, private cd: ChangeDetectorRef) {

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      cover_image: [null],
      images: [null],
    });


  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.categoriesService.getAllCategoriesByUser().subscribe({
      next: (categories: Category[]) => {
        this.categories = [...categories]; // forzar nueva referencia
        this.cd.detectChanges();
      },
      error: (err) => console.error("Error al cargar productos", err)
    });
  }

  onCoverImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form.get('cover_image')?.setValue(file);
    }
  }

  onGalleryImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      this.form.get('images')?.setValue(fileArray);
    }
  }


  create(){
    if (this.form.valid) {
      const formData = new FormData();

      formData.append('name', this.form.get('name')?.value);
      formData.append('description', this.form.get('description')?.value);
      formData.append('price', this.form.get('price')?.value);
      formData.append('category_id', this.form.get('category_id')?.value);

      const coverImage = this.form.get('cover_image')?.value;
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      const galleryImages: File[] = this.form.get('images')?.value || [];
      galleryImages.forEach((img, index) => {
        formData.append('images[]', img);
      });

      this.confirm(formData)
    }


  }
}
