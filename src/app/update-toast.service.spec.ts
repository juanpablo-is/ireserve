import { TestBed } from '@angular/core/testing';

import { UpdateToastService } from './update-toast.service';

describe('UpdateToastService', () => {
  let service: UpdateToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
