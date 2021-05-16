import { TestBed } from '@angular/core/testing';

import { ScrumService } from './scrum.service';

describe('ScrumService', () => {
  let service: ScrumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
