import { TestBed } from '@angular/core/testing';

import { GameEngineService } from './game-engine.service';

describe('GameEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameEngineService = TestBed.get(GameEngineService);
    expect(service).toBeTruthy();
  });
});
