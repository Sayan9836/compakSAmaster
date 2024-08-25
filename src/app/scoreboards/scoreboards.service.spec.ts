import { TestBed } from '@angular/core/testing';

import { ScoreboardsService } from './scoreboards.service';

describe('ScoreboardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScoreboardsService = TestBed.get(ScoreboardsService);
    expect(service).toBeTruthy();
  });
});
