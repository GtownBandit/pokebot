import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTypeLabelComponent } from './pokemon-type-label.component';

describe('PokemonTypeLabelComponent', () => {
  let component: PokemonTypeLabelComponent;
  let fixture: ComponentFixture<PokemonTypeLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonTypeLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonTypeLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
