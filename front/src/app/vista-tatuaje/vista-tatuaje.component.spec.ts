import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTatuajeComponent } from './vista-tatuaje.component';

describe('VistaTatuajeComponent', () => {
  let component: VistaTatuajeComponent;
  let fixture: ComponentFixture<VistaTatuajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VistaTatuajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistaTatuajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
