import { TestBed } from '@angular/core/testing';

import { CharacterSelectionService } from './character-selection.service';

describe('CharacterSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharacterSelectionService = TestBed.get(CharacterSelectionService);
    expect(service).toBeTruthy();
  });
});
