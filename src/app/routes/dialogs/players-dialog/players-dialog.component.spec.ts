import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersDialogComponent } from './players-dialog.component';

describe('PlayersDialogComponent', () => {
  let component: PlayersDialogComponent;
  let fixture: ComponentFixture<PlayersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should add player", () => {
    component.newPlayer = "Francisco";
    component.addPlayer();
    expect(component.dialogPlayers).toContain("Francisco");
    component.newPlayer = "Javier";
    component.addPlayer();
    expect(component.dialogPlayers).toContain("Javier");
    expect(component.newPlayer).toEqual("");
  })
});
