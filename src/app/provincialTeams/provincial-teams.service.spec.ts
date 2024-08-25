import { TestBed } from '@angular/core/testing';

import { ProvincialTeamsService } from './provincial-teams.service';

describe('ProvincialTeamsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvincialTeamsService = TestBed.get(ProvincialTeamsService);
    expect(service).toBeTruthy();
  });
});
