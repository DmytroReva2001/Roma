import { Component } from '@angular/core';
import { InfoService } from '../services/info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // Variable para guardar info
  informacion: any = {};

  constructor(
    private infoService: InfoService,
    private router: Router
  ) {
    // Suscribimos al response de servicio
    this.infoService.getInformacion().subscribe(datos => {
      datos.forEach(item => {
        this.informacion[item.dato] = item.valor;
      });
    });
  }

  goTo(url:string)
  {
    this.router.navigateByUrl(url);
  }
}