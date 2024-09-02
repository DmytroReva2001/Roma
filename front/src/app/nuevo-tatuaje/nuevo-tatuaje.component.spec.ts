import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTatuajeComponent } from './nuevo-tatuaje.component';

describe('NuevoTatuajeComponent', () => {
  let component: NuevoTatuajeComponent;
  let fixture: ComponentFixture<NuevoTatuajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoTatuajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoTatuajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
