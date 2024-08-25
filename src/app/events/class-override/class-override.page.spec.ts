import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassOverridePage } from './class-override.page';

describe('ClassOverridePage', () => {
  let component: ClassOverridePage;
  let fixture: ComponentFixture<ClassOverridePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassOverridePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassOverridePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
