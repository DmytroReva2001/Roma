import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTipoProductoComponent } from './nuevo-tipo-producto.component';

describe('NuevoTipoProductoComponent', () => {
  let component: NuevoTipoProductoComponent;
  let fixture: ComponentFixture<NuevoTipoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoTipoProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoTipoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
