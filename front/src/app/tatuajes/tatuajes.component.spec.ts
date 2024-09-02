import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TatuajesComponent } from './tatuajes.component';

describe('TatuajesComponent', () => {
  let component: TatuajesComponent;
  let fixture: ComponentFixture<TatuajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TatuajesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TatuajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
