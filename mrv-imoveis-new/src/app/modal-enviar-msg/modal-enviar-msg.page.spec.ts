import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEnviarMsgPage } from './modal-enviar-msg.page';

describe('ModalEnviarMsgPage', () => {
  let component: ModalEnviarMsgPage;
  let fixture: ComponentFixture<ModalEnviarMsgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEnviarMsgPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEnviarMsgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
