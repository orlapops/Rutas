import { TestBed, inject } from '@angular/core/testing';

import { VisitanService } from './visitan.service';

describe('VisitanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisitanService]
    });
  });

  it('should be created', inject([VisitanService], (service: VisitanService) => {
    expect(service).toBeTruthy();
  }));
});
