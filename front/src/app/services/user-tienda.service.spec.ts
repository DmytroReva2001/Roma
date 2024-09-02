import { TestBed } from '@angular/core/testing';

import { UserTiendaService } from './user-tienda.service';

describe('UserTiendaService', () => {
  let service: UserTiendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTiendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
