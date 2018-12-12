import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciaPage } from './licencia.page';

describe('LicenciaPage', () => {
  let component: LicenciaPage;
  let fixture: ComponentFixture<LicenciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenciaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
