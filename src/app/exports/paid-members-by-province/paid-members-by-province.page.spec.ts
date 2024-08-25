import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidMembersByProvincePage } from './paid-members-by-province.page';

describe('PaidMembersByProvincePage', () => {
  let component: PaidMembersByProvincePage;
  let fixture: ComponentFixture<PaidMembersByProvincePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidMembersByProvincePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidMembersByProvincePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
