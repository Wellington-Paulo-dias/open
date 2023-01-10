import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChatPage } from './modal-chat.page';

describe('ModalChatPage', () => {
  let component: ModalChatPage;
  let fixture: ComponentFixture<ModalChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
