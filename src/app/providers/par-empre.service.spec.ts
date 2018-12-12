import { TestBed } from '@angular/core/testing';

import { ParEmpreService } from './par-empre.service';

describe('ParEmpreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParEmpreService = TestBed.get(ParEmpreService);
    expect(service).toBeTruthy();
  });
});
