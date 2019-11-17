import { TestBed } from '@angular/core/testing';

import { ServerConnectionManager } from './server-connection-manager.service';

describe('ServerListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerConnectionManager = TestBed.get(ServerConnectionManager);
    expect(service).toBeTruthy();
  });
});
