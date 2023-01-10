import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLigamosParaVocePage } from './modal-ligamos-para-voce.page';

describe('ModalLigamosParaVocePage', () => {
  let component: ModalLigamosParaVocePage;
  let fixture: ComponentFixture<ModalLigamosParaVocePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLigamosParaVocePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLigamosParaVocePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
