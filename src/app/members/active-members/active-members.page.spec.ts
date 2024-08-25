import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveMembersPage } from './active-members.page';

describe('ActiveMembersPage', () => {
  let component: ActiveMembersPage;
  let fixture: ComponentFixture<ActiveMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveMembersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
