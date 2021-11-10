import { TestBed } from '@angular/core/testing';

import { GlobalValidatorsService } from './global-validators.service';

describe('GlobalValidatorsService', () => {
  let service: GlobalValidatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalValidatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
