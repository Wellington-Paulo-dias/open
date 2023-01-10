import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatosMrvPage } from './contatos-mrv.page';

describe('ContatosMrvPage', () => {
  let component: ContatosMrvPage;
  let fixture: ComponentFixture<ContatosMrvPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContatosMrvPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatosMrvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
