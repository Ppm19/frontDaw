import { TestBed } from '@angular/core/testing';

import { LoginRegistroService } from './login-registro.service';

describe('LoginRegistroService', () => {
  let service: LoginRegistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginRegistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
