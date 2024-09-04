import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { TatuajeService } from '../services/tatuaje.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Tatuaje } from '../models/tatuaje';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nuevo-tatuaje',
  templateUrl: './nuevo-tatuaje.component.html',
  styleUrl: './nuevo-tatuaje.component.css'
})
export class NuevoTatuajeComponent implements OnInit{

  formularioTatuaje!: FormGroup; // Definir el FormGroup

  imagenPrincipal: string = '';
  imagenesAdicionales: string[] = [];

  tatuaje!: Tatuaje;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private tatuajeService: TatuajeService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.formularioTatuaje = this.fb.group({
      id: [''],
      nombreTatuaje: ['', [Validators.required, Validators.maxLength(20)]],
      descripcion: ['', [Validators.maxLength(50)]],
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
      this.tatuajeService.getTatuajeById(infoId).subscribe(tatuaje => {
        this.tatuaje = tatuaje;

        this.formularioTatuaje.patchValue({
          id: this.tatuaje.id,
          nombreTatuaje: this.tatuaje.nombreTatuaje,
          descripcion: this.tatuaje.descripcion,
        });

        this.imagenPrincipal = this.tatuaje.imagenes[0];
        this.imagenesAdicionales = this.tatuaje.imagenes.slice(1);

        Swal.close();
      });
    } else {
      Swal.close();
    }
  }

  // Método de filtrado antes de abrir selector
  openFilePicker(index: number) {

    // Filtrado de img principal
    if (index === 0 )
      {
        if (this.imagenPrincipal)
        {
            this.accionImg(0);
        }
        else
        {
          this.pickImg(index);
        }
      }
      // Filtrado de imgs secundarias
      else
      {
        if (this.imagenesAdicionales[index-1])
        {
          this.accionImg(index);
        }
        else
        {
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
  guardarTatuaje() {
    if (this.formularioTatuaje.invalid) {
      // Si el formulario no es válido, muestra un mensaje de error o resalta los campos incorrectos
      return;
    }

    // Obtener los datos del formulario
    const tatuajeDatos = this.formularioTatuaje.value;

    // Crear el array de imágenes según el formato deseado
    const imagenesParaGuardar: string[] = [this.imagenPrincipal];
    for (let i = 0; i < this.imagenesAdicionales.length; i++) {
        imagenesParaGuardar.push(this.imagenesAdicionales[i]);
    }

    tatuajeDatos.imagenes = imagenesParaGuardar;

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

    // Llama al servicio para guardar el Tatuaje
    this.tatuajeService.guardarTatuaje(tatuajeDatos).subscribe({
        next: response => {
          Swal.close();

          Swal.fire({
            title: 'Éxito',
            text: `Tatuaje guardado correctamente.`,
            icon: 'success'
          });
            
          this.clearData();
        },
        error: error => {
          Swal.close();

          Swal.fire({
            icon: "error",
            title: "Se ha producido un error al guardar el tatuaje.",
            text: error.error.message,
          });

          this.clearData();
        }
    });
}

  clearData() {
    this.formularioTatuaje.reset();
    this.imagenPrincipal = "";
    this.imagenesAdicionales = [];
  }

  // Método que comprueba que hay imagenes guardadas en variables de imagenes para la validación
  hayImagenes(): boolean {
    // Verifica si la imagen principal no está vacía
    const imagenPrincipalNoVacia = this.imagenPrincipal.trim() !== '';

    // Verifica si hay al menos una imagen adicional que no esté vacía
    const algunaImagenAdicionalNoVacia = this.imagenesAdicionales.some(image => image.trim() !== '');

    // Devuelve true si la imagen principal no está vacía o si hay al menos una imagen adicional que no está vacía
    return imagenPrincipalNoVacia || algunaImagenAdicionalNoVacia;
  }

  accionImg(index: number) {
    Swal.fire({
      title: "¿Que necesita hacer?",
      text: "Seleccione la acción:",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cambiar la imagen",
      cancelButtonText: "Eliminar la imagen",
    }).then((result) => {
      if (result.isConfirmed) {
        this.pickImg(index);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (index === 0) {
          this.imagenPrincipal = "";
        } else {
          this.imagenesAdicionales[index-1] = "";
        } 
      }
    });
  }
  
  back()
  {
    this.location.back();
  }
}