import { TestBed } from '@angular/core/testing';

import { ConnectionManager } from '../../../connection/src/lib/connection-manager';

describe('ServerListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConnectionManager = TestBed.get(ConnectionManager);
    expect(service).toBeTruthy();
  });
});
