import { TestBed } from '@angular/core/testing';

import { CartCanLoadGuard } from './cart-can-load.guard';

describe('CartCanLoadGuard', () => {
  let guard: CartCanLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CartCanLoadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
