import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaClaveComponent } from './nueva-clave.component';

describe('NuevaClaveComponent', () => {
  let component: NuevaClaveComponent;
  let fixture: ComponentFixture<NuevaClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevaClaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
