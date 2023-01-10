import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImoveisInternaPage } from './imoveis-interna.page';

describe('ImoveisInternaPage', () => {
  let component: ImoveisInternaPage;
  let fixture: ComponentFixture<ImoveisInternaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImoveisInternaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImoveisInternaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
