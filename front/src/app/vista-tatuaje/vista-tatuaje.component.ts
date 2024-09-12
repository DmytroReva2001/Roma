import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Tatuaje } from '../models/tatuaje';
import { TatuajeService } from '../services/tatuaje.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-vista-tatuaje',
  templateUrl: './vista-tatuaje.component.html',
  styleUrl: './vista-tatuaje.component.css'
})
export class VistaTatuajeComponent {
  tatuaje!: Tatuaje;

  selectedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private tatuajeService: TatuajeService,
    private location: Location
  ) {}
  
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
    const tatuajeId = this.route.snapshot.paramMap.get('id');
    if (tatuajeId) {
      // Consultamos toda la info sobre el producto
      this.tatuajeService.getTatuajeById(tatuajeId).subscribe(tatuaje => {
        this.tatuaje = tatuaje;
        // Seleccionamos la primera imagen por defecto
        this.selectImage(this.tatuaje.imagenes[0]);
      });
    }
  }  

  // Método para seleccionar la imagen principal
  selectImage(image: string): void {
    this.selectedImage = image;
    Swal.close();
  }

  abrirImg() {
    Swal.fire({
      imageUrl: this.selectedImage,
      imageAlt: 'Imagen seleccionada',
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  back()
  {
    this.location.back();
  }
}
