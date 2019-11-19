import { TestBed } from '@angular/core/testing';

import { ServerSelectionService } from './server-selection.service';

describe('ServerSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerSelectionService = TestBed.get(ServerSelectionService);
    expect(service).toBeTruthy();
  });
});
