import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaProximidadePage } from './busca-proximidade.page';

describe('BuscaProximidadePage', () => {
  let component: BuscaProximidadePage;
  let fixture: ComponentFixture<BuscaProximidadePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscaProximidadePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscaProximidadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
