import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanciamentoPage } from './financiamento.page';

describe('FinanciamentoPage', () => {
  let component: FinanciamentoPage;
  let fixture: ComponentFixture<FinanciamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanciamentoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanciamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
