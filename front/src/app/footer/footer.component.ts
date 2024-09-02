import { Component } from '@angular/core';
import { InfoService } from '../services/info.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // Variable para guardar info
  informacion: any = {};
  
  constructor(
    private infoService: InfoService,
  ) {
    // Suscribimos al response de servicio
    this.infoService.getInformacion().subscribe(datos => {
      datos.forEach(item => {
        this.informacion[item.dato] = item.valor;
      });
    });
  }
}