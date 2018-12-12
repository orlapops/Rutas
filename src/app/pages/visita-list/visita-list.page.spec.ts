import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaListPage } from './visita-list.page';

describe('VisitaListPage', () => {
  let component: VisitaListPage;
  let fixture: ComponentFixture<VisitaListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitaListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitaListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
