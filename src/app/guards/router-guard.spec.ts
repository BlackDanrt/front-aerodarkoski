import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { routerGuard } from './router-guard';

describe('routerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => routerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
