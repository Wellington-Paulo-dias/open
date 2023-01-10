import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidioMcmvPage } from './subsidio-mcmv.page';

describe('SubsidioMcmvPage', () => {
  let component: SubsidioMcmvPage;
  let fixture: ComponentFixture<SubsidioMcmvPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidioMcmvPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidioMcmvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
