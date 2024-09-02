import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaInformacionComponent } from './nueva-informacion.component';

describe('NuevaInformacionComponent', () => {
  let component: NuevaInformacionComponent;
  let fixture: ComponentFixture<NuevaInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevaInformacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
