import { TestBed, inject } from '@angular/core/testing';

import { ProdsService } from './prods.service';

describe('ProdsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProdsService]
    });
  });

  it('should be created', inject([ProdsService], (service: ProdsService) => {
    expect(service).toBeTruthy();
  }));
});
