import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClubPage } from './create-club.page';

describe('CreateClubPage', () => {
  let component: CreateClubPage;
  let fixture: ComponentFixture<CreateClubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
