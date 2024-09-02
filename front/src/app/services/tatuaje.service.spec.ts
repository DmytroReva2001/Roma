import { TestBed } from '@angular/core/testing';

import { TatuajeService } from './tatuaje.service';

describe('TatuajeService', () => {
  let service: TatuajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TatuajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
