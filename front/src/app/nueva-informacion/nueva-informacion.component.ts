import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InfoService } from '../services/info.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { informacion } from '../models/informacion';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nueva-informacion',
  templateUrl: './nueva-informacion.component.html',
  styleUrl: './nueva-informacion.component.css'
})
export class NuevaInformacionComponent implements OnInit{

  // Config para hacer switch de formularios
  formMode: 'texto' | 'imagen' = 'texto';

  formularioInformacion!: FormGroup;
  imagen: string = '';

  infoFormTexto: FormGroup;
  infoFormImagen: FormGroup;

  informacion!: informacion;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private infoService: InfoService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.infoFormTexto = this.fb.group({
      id: [''],
      dato: ['', [Validators.required, Validators.maxLength(20)]],
      valor: ['', [Validators.required]],
      tipoDato: ['texto', [Validators.required]],
    });

    this.infoFormImagen = this.fb.group({
      id: [''],
      dato: ['', [Validators.required, Validators.maxLength(20)]],
      tipoDato: ['imagen', [Validators.required]]
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
      this.infoService.getInfoById(infoId).subscribe(info => {
        this.informacion = info;
  
        if (this.informacion.tipoDato === "imagen") {
          this.formMode = 'imagen';
          this.infoFormImagen.patchValue({
            id: this.informacion.id,
            dato: this.informacion.dato
          });

          this.infoFormTexto.patchValue({
            id: this.informacion.id,
            dato: this.informacion.dato
          });

          this.imagen = this.informacion.valor;
        } else {
          this.infoFormTexto.patchValue({
            id: this.informacion.id,
            dato: this.informacion.dato,
            valor: this.informacion.valor,
            tipoDato: this.informacion.tipoDato
          });

          this.infoFormImagen.patchValue({
            id: this.informacion.id,
            dato: this.informacion.dato
          });
        }
  
        Swal.close();
      });
    } else {
      Swal.close();
    }
  }  

  // Método de filtrado antes de abrir selector
  openFilePicker() {
    const fileInputElement = this.fileInput.nativeElement;
    fileInputElement.click();
  }

  // Lectura y colocación de imagenes
  handleFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.imagen = result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método que comprueba que hay imagenes guardadas en variables de imagenes para la validación
  hayImagen(): boolean {
    // Verifica si la imagen principal no está vacía
    const imagenNoVacia = this.imagen.trim() !== '';
    return imagenNoVacia;
  }

  clearData() {
    this.infoFormTexto.reset();
    this.infoFormImagen.reset();
    this.imagen = "";

    this.informacion.tipoDato = "texto"
  }

  switchToTexto() {
    this.formMode = 'texto';
  }

  switchToImagen() {
    this.formMode = 'imagen';
  }

  onSubmit() {
    if (this.formMode === 'texto') {
      if (this.infoFormTexto.invalid) {
        return;
      }

      const data = {
        id: this.infoFormTexto.get('id')?.value,
        dato: this.infoFormTexto.get('dato')?.value,
        valor: this.infoFormTexto.get('valor')?.value,
        tipoDato: this.infoFormTexto.get('tipoDato')?.value === 'texto' ? 'texto' : 'url'
      };

      this.alta(data);
    } else {
      if (this.formMode === 'imagen') {
        if (this.infoFormImagen.valid && this.hayImagen()) {
        
          const data = {
            id: this.infoFormTexto.get('id')?.value,
            dato: this.infoFormImagen.get('dato')?.value,
            valor: this.imagen,
            tipoDato: 'imagen'
          };
          this.alta(data);
        }
      }
    }
  }

  checkboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.infoFormTexto.get('tipoDato')?.setValue('url');
    } else {
      this.infoFormTexto.get('tipoDato')?.setValue('texto');
    }
  }

  private alta(data: { dato: any; valor: any; tipoDato: string; }) {
    this.infoService.altaInfo(data).subscribe({
      next: response => {
        Swal.fire({
          title: 'Éxito',
          text: `Información guardado correctamente.`,
          icon: 'success'
        });
        this.clearData();
      },
      error: error => {
        Swal.fire({
          icon: "error",
          title: "Se ha producido un error al guardar la información.",
          text: error.error,
        });
      }
    });
  }

  back()
  {
    this.location.back();
  }
}