import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { TipoProductoService } from '../services/tipo-producto.service';
import { TipoProducto } from '../models/tipo-producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Producto } from '../models/producto';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css'],
})
export class NuevoProductoComponent implements OnInit{
  formularioProducto!: FormGroup;

  imagenPrincipal: string = '';
  imagenesAdicionales: string[] = [];

  tiposDeProductos: TipoProducto[] = [];

  producto!: Producto;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.formularioProducto = this.fb.group({
      id: [''],
      nombreProducto: ['', [Validators.required, Validators.maxLength(20)]],
      descripcionCorta: ['', [Validators.maxLength(50)]],
      descripcionLarga: ['', [Validators.maxLength(100)]],
      precio: [[Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Validar números con máximo 2 decimales
      tipoProducto: ['', [Validators.required, Validators.pattern(/^(?!Seleccione...).+$/)],
      ], // Validar que no sea "Seleccione..."
    });

    // Al inicializar el componente, obtenemos todos los tipos de productos
    this.tipoProductoService.getTiposProducts().subscribe((tipos) => {
      this.tiposDeProductos = tipos;
    });
  }

  ngOnInit(): void {
    // Animación de cargando para que user no se desespere
    Swal.fire({
      title: "Cargando...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Sacamos el id de los parametros
    const infoId = this.route.snapshot.paramMap.get('id');
    if (infoId) {
      // Consultamos toda la info sobre el producto
      this.productoService.getProductById(infoId).subscribe(producto => {
        this.producto = producto;

        this.formularioProducto.patchValue({
          id: this.producto.id,
          nombreProducto: this.producto.nombreProducto,
          descripcionCorta: this.producto.descripcionCorta,
          descripcionLarga:  this.producto.descripcionLarga,
          precio:  this.producto.precio,
          tipoProducto: this.producto.tipoProducto,
        });

        this.imagenPrincipal = this.producto.imagenes[0];
        this.imagenesAdicionales = this.producto.imagenes.slice(1);

        Swal.close();
      });
    } else {
      Swal.close();
    }
  }


  // Método de filtrado antes de abrir selector
  openFilePicker(index: number) {
    // Filtrado de img principal
    if (index === 0) {
      if (this.imagenPrincipal) {
        this.accionImg(0);
      } else {
        this.pickImg(index);
      }
    }
    // Filtrado de imgs secundarias
    else {
      if (this.imagenesAdicionales[index - 1]) {
        this.accionImg(index);
      } else {
        this.pickImg(index);
      }
    }
  }

  // Apertura de ventana de selección de archivos
  private pickImg(index: number) {
    const fileInputElement = this.fileInput.nativeElement;
    fileInputElement.setAttribute('data-index', index.toString());
    fileInputElement.click();
  }

  // Lectura y colocación de imagenes
  handleFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;
    const index = +fileInput.getAttribute('data-index')!;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;

        if (index === 0) {
          this.imagenPrincipal = result;
        } else if (index >= 1 && index <= 4) {
          this.imagenesAdicionales[index - 1] = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para guardar producto
  guardarProducto() {
    if (this.formularioProducto.invalid) {
      // Si el formulario no es válido, muestra un mensaje de error o resalta los campos incorrectos
      return;
    }

    // Obtener los datos del formulario
    const productoDatos = this.formularioProducto.value;

    // Crear el array de imágenes según el formato deseado
    const imagenesParaGuardar: string[] = [this.imagenPrincipal];
    for (let i = 0; i < this.imagenesAdicionales.length; i++) {
      imagenesParaGuardar.push(this.imagenesAdicionales[i]);
    }

    productoDatos.imagenes = imagenesParaGuardar;

    // Llama al servicio para guardar el producto
    this.productoService.guardarProducto(productoDatos).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Éxito',
          text: `Producto guardado correctamente.`,
          icon: 'success',
        });
        this.clearData();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Se ha producido un error al guardar el producto.',
          text: error.error.message,
        });
      },
    });
  }

  // Método que comprueba que hay imagenes guardadas en variables de imagenes para la validación
  hayImagenes(): boolean {
    // Verifica si la imagen principal no está vacía
    const imagenPrincipalNoVacia = this.imagenPrincipal.trim() !== '';

    // Verifica si hay al menos una imagen adicional que no esté vacía
    const algunaImagenAdicionalNoVacia = this.imagenesAdicionales.some(
      (image) => image.trim() !== ''
    );

    // Devuelve true si la imagen principal no está vacía o si hay al menos una imagen adicional que no está vacía
    return imagenPrincipalNoVacia || algunaImagenAdicionalNoVacia;
  }

  clearData() {
    this.formularioProducto.reset();
    this.imagenPrincipal = '';
    this.imagenesAdicionales = [];

    this.formularioProducto.get('tipoProducto')?.setValue('');
  }

  accionImg(index: number) {
    Swal.fire({
      title: '¿Que necesita hacer?',
      text: 'Seleccione la acción:',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cambiar la imagen',
      cancelButtonText: 'Eliminar la imagen',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pickImg(index);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (index === 0) {
          this.imagenPrincipal = '';
        } else {
          this.imagenesAdicionales[index - 1] = '';
        }
      }
    });
  }
  back()
  {
    this.location.back();
  }
}