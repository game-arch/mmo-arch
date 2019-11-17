import { TestBed } from '@angular/core/testing';

import { ServerListService } from './server-list.service';

describe('ServerListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerListService = TestBed.get(ServerListService);
    expect(service).toBeTruthy();
  });
});
