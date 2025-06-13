import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAccesoriosComponent } from './lista-accesorios.component';

describe('ListaAccesoriosComponent', () => {
  let component: ListaAccesoriosComponent;
  let fixture: ComponentFixture<ListaAccesoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAccesoriosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaAccesoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
