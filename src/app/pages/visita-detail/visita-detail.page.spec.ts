import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaDetailPage } from './visita-detail.page';

describe('VisitaDetailPage', () => {
  let component: VisitaDetailPage;
  let fixture: ComponentFixture<VisitaDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitaDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitaDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
