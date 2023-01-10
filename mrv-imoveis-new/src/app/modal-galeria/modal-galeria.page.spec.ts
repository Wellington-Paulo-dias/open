import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGaleriaPage } from './modal-galeria.page';

describe('ModalGaleriaPage', () => {
  let component: ModalGaleriaPage;
  let fixture: ComponentFixture<ModalGaleriaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGaleriaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGaleriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
