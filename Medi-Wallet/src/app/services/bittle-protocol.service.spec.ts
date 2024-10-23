import { TestBed } from '@angular/core/testing';

import { BittleProtocolService } from './bittle-protocol.service';

describe('BittleProtocolService', () => {
  let service: BittleProtocolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BittleProtocolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
