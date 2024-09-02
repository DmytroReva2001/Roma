import { Component, OnInit } from '@angular/core';
import { InfoService } from './services/info.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  informacion: any = {};

  constructor(
    private infoService: InfoService,
    private titleService: Title,
  ) {}

  // Al iniciar la app establecer título de página sacada de BD con uso de API llamando al método de consulta de información sobre la tienda
  ngOnInit(): void {
    this.infoService.getInformacion().subscribe(datos => {
      datos.forEach(item => {
        this.informacion[item.dato] = item.valor;
      });
      
      // Establecer el título de la página después de obtener los datos
      this.titleService.setTitle(this.informacion.nombreEmpresa);
    });
  }
}