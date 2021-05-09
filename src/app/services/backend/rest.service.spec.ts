import { TestBed } from '@angular/core/testing';

import { RestService } from './rest.service';

describe('MenuService', () => {
  let service: RestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
