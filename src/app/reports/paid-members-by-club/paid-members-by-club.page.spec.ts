import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidMembersByClubPage } from './paid-members-by-club.page';

describe('PaidMembersByClubPage', () => {
  let component: PaidMembersByClubPage;
  let fixture: ComponentFixture<PaidMembersByClubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidMembersByClubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidMembersByClubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
