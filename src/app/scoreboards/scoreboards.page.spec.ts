import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardsPage } from './scoreboards.page';

describe('ScoreboardsPage', () => {
  let component: ScoreboardsPage;
  let fixture: ComponentFixture<ScoreboardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreboardsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreboardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
