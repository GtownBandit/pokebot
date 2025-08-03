import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTeamManagerComponent } from './active-team-manager.component';

describe('ActiveTeamManagerComponent', () => {
  let component: ActiveTeamManagerComponent;
  let fixture: ComponentFixture<ActiveTeamManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTeamManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveTeamManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
