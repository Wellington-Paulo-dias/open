import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGaleriaInternaPage } from './modal-galeria-interna.page';

describe('ModalGaleriaInternaPage', () => {
  let component: ModalGaleriaInternaPage;
  let fixture: ComponentFixture<ModalGaleriaInternaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGaleriaInternaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGaleriaInternaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
