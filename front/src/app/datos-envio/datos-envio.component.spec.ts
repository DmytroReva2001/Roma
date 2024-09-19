import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosEnvioComponent } from './datos-envio.component';

describe('DatosEnvioComponent', () => {
  let component: DatosEnvioComponent;
  let fixture: ComponentFixture<DatosEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosEnvioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
