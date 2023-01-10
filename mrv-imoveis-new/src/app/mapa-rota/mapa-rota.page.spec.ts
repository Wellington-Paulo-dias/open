import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaRotaPage } from '../mapa-rota/mapa-rota.page'

describe('MapaRotaPage', () => {
  let component: MapaRotaPage;
  let fixture: ComponentFixture<MapaRotaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaRotaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaRotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
