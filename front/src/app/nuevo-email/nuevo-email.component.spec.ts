import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoEmailComponent } from './nuevo-email.component';

describe('NuevoEmailComponent', () => {
  let component: NuevoEmailComponent;
  let fixture: ComponentFixture<NuevoEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
