import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibocajaPage } from './recibocaja.page';

describe('RecibocajaPage', () => {
  let component: RecibocajaPage;
  let fixture: ComponentFixture<RecibocajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecibocajaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecibocajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
