import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFichaTecnicaPage } from './modal-ficha-tecnica.page';

describe('ModalFichaTecnicaPage', () => {
  let component: ModalFichaTecnicaPage;
  let fixture: ComponentFixture<ModalFichaTecnicaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFichaTecnicaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFichaTecnicaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
