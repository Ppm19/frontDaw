import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMovilesComponent } from './lista-moviles.component';

describe('ListaMovilesComponent', () => {
  let component: ListaMovilesComponent;
  let fixture: ComponentFixture<ListaMovilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMovilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaMovilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
