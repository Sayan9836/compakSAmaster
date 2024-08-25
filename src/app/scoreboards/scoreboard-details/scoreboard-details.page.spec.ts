import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardDetailsPage } from './scoreboard-details.page';

describe('ScoreboardDetailsPage', () => {
  let component: ScoreboardDetailsPage;
  let fixture: ComponentFixture<ScoreboardDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreboardDetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreboardDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
