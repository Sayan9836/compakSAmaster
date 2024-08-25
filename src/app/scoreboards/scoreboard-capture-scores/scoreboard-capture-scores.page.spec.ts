import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardCaptureScoresPage } from './scoreboard-capture-scores.page';

describe('ScoreboardCaptureScoresPage', () => {
  let component: ScoreboardCaptureScoresPage;
  let fixture: ComponentFixture<ScoreboardCaptureScoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreboardCaptureScoresPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreboardCaptureScoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
