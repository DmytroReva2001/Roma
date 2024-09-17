import { Component, AfterViewChecked } from '@angular/core';
import { InfoService } from '../services/info.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterViewChecked {
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

    // Suscribirse a NavigationEnd para desplazar a la parte superior después de la navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100); // Retraso opcional para asegurar que la página se haya cargado completamente
    });
  }

  // Método para asegurar que la página se desplaza hacia arriba
  ngAfterViewChecked(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}