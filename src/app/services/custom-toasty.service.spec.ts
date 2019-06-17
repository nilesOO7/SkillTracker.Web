import { TestBed, inject } from '@angular/core/testing';

import { CustomToastyService } from './custom-toasty.service';

describe('CustomToastyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomToastyService]
    });
  });

  it('should be created', inject([CustomToastyService], (service: CustomToastyService) => {
    expect(service).toBeTruthy();
  }));
});
