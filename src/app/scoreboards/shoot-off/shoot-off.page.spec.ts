import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShootOffPage } from './shoot-off.page';

describe('ShootOffPage', () => {
  let component: ShootOffPage;
  let fixture: ComponentFixture<ShootOffPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShootOffPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShootOffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
