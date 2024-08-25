import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveMembersPage } from './inactive-members.page';

describe('InactiveMembersPage', () => {
  let component: InactiveMembersPage;
  let fixture: ComponentFixture<InactiveMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveMembersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
