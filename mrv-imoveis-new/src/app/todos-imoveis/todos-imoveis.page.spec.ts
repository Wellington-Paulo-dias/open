import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosImoveisPage } from './todos-imoveis.page';

describe('TodosImoveisPage', () => {
  let component: TodosImoveisPage;
  let fixture: ComponentFixture<TodosImoveisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosImoveisPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosImoveisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
