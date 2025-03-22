import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { ScoreType } from '../../core/enums/score-type.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ScoreDialogComponent } from '../dialogs/score-dialog/score-dialog.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ScoreDialogComponent>>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);

    dialogRefSpy.afterClosed.and.returnValue(of({name:"Player1", type: ScoreType.BET}));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [{ MatSnackBar, useValue: snackBarSpy },
      { MatDialog, useValue: dialogSpy }
      ]
    })
      .overrideProvider(MatSnackBar, { useValue: snackBarSpy })
      .overrideProvider(MatDialog, { useValue: dialogSpy })
      .compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.players = ["Player1", "Player2", "Player3", "Player4"];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should get max of round", () => {
    expect(component.maxOfRound(0)).toEqual(1);
    expect(component.maxOfRound(8)).toEqual(8);
    expect(component.maxOfRound(9)).toEqual(8);
    expect(component.maxOfRound(16)).toEqual(1);
  });

  it("should tell if a round is active", () => {
    component.latestCell = { round: 3, player: 1 };
    expect(component.isActiveRound(3)).toBeTrue();
    expect(component.isActiveRound(4)).toBeFalse();
    expect(component.isActiveRound(2)).toBeFalse();
  });

  it("should tell if a round is full bet", () => {
    component.bets = [[0, 0, 0], [0, 0, undefined], [0, 0, 0], [0, 0, 0], [undefined, undefined, undefined]];
    expect(component.isFullRound(ScoreType.BET, 0)).toBeTrue();
    expect(component.isFullRound(ScoreType.BET, 1)).toBeFalse();
    expect(component.isFullRound(ScoreType.BET, 2)).toBeTrue();
    expect(component.isFullRound(ScoreType.BET, 3)).toBeTrue();
    expect(component.isFullRound(ScoreType.BET, 4)).toBeFalse();
  });

  it("should tell if a round is full achieved", () => {
    component.achieved = [[0, 0, 0], [0, 0, undefined], [0, 0, 0], [0, 0, 0], [undefined, undefined, undefined]];
    expect(component.isFullRound(ScoreType.ACHIEVED, 0)).toBeTrue();
    expect(component.isFullRound(ScoreType.ACHIEVED, 1)).toBeFalse();
    expect(component.isFullRound(ScoreType.ACHIEVED, 2)).toBeTrue();
    expect(component.isFullRound(ScoreType.ACHIEVED, 3)).toBeTrue();
    expect(component.isFullRound(ScoreType.ACHIEVED, 4)).toBeFalse();
  });

  it("should toggle achieved modal", () => {
    spyOn(component, "openDialog");
    component.latestCell = { round: 3, player: 1 };
    component.bets = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    component.toggleAchievedModal(8, 2);
    expect(component.openDialog).not.toHaveBeenCalled();
    component.toggleAchievedModal(3, 1);
    expect(component.openDialog).toHaveBeenCalledWith(ScoreType.ACHIEVED, 3, 1);
  });

  it("should toggle bet modal", () => {
    spyOn(component, "openDialog");
    component.latestCell = { round: 3, player: 1 };
    component.bets = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    component.toggleBetModal(8, 2);
    expect(component.openDialog).not.toHaveBeenCalled();
    component.toggleBetModal(3, 1);
    expect(component.openDialog).toHaveBeenCalledWith(ScoreType.BET, 3, 1);
  });

  it("should check next cell", () => {
    component.nextCell = { round: 7, player: 3 };
    expect(component.isNextCell(7, 3)).toBeTrue();
    expect(component.isNextCell(7, 2)).toBeFalse();
  });

  it("should check if is last player of the round", () => {
    component.players = ["Player1"];
    expect(component.isLastPlayerOfRound(0, 0)).toBeTrue();
    expect(component.isLastPlayerOfRound(1, 0)).toBeTrue();
    component.players = ["Player1", "Player2"];
    expect(component.isLastPlayerOfRound(0, 0)).toBeFalse();
    expect(component.isLastPlayerOfRound(0, 1)).toBeTrue();
    expect(component.isLastPlayerOfRound(1, 0)).toBeTrue();
    expect(component.isLastPlayerOfRound(1, 1)).toBeFalse();
    component.players = ["Player1", "Player2", "Player3"];
    expect(component.isLastPlayerOfRound(0, 0)).toBeFalse();
    expect(component.isLastPlayerOfRound(0, 1)).toBeFalse();
    expect(component.isLastPlayerOfRound(0, 2)).toBeTrue();
    expect(component.isLastPlayerOfRound(1, 0)).toBeTrue();
    expect(component.isLastPlayerOfRound(1, 1)).toBeFalse();
    expect(component.isLastPlayerOfRound(1, 2)).toBeFalse();
    expect(component.isLastPlayerOfRound(2, 0)).toBeFalse();
    expect(component.isLastPlayerOfRound(2, 1)).toBeTrue();
    expect(component.isLastPlayerOfRound(2, 2)).toBeFalse();
  });

  it("should set next cell", () => {
    component.players = ["Player1", "Player2", "Player3", "Player4"];
    expect(component.setNextCell(8, 2)).toEqual({ round: 8, player: 3 });
    expect(component.setNextCell(8, 3)).toEqual({ round: 8, player: 0 });
    expect(component.setNextCell(8, 0)).toEqual({ round: 8, player: 1 });
  });

  it("should set next round", () => {
    component.players = ["Player1", "Player2", "Player3", "Player4"];
    component.rounds = ["1", "2", "3", "4", "5"];
    component.setNextRound(3);
    expect(component.nextCell).toEqual({ round: 4, player: 0 });
    expect(component.isStartingRound(4, 0)).toBeTrue();
    expect(snackBarSpy.open).toHaveBeenCalledWith("Empieza la ronda 5", "Close");
  });

  it("should set achieved and set next round if round is full", () => {
    spyOn(component, "calculateScore");
    spyOn(component, "setNextRound");
    component.achieved = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
    component.setAchieved(3, 2, 8);
    expect(component.achieved[3][2]).toEqual(8);
    expect(component.calculateScore).toHaveBeenCalledWith(3, 2);
    expect(component.setNextRound).toHaveBeenCalledWith(3);
  });

  it("should set achieved and not set next round if round is not full", () => {
    spyOn(component, "calculateScore");
    spyOn(component, "setNextRound");
    component.achieved = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [undefined, 0, 0], [0, 0, undefined]];
    component.setAchieved(3, 2, 8);
    expect(component.achieved[3][2]).toEqual(8);
    expect(component.calculateScore).toHaveBeenCalledWith(3, 2);
    expect(component.setNextRound).not.toHaveBeenCalled();
  });

  it("should calculate score", () => {
    component.bets = [[0, 1, 2, 2], [0, 0, undefined, undefined]];
    component.achieved = [[1, 1, 0, 2], [0, undefined, 0, undefined]];
    component.calculateScore(0, 0);
    component.calculateScore(0, 1);
    component.calculateScore(0, 2);
    component.calculateScore(0, 3);
    component.calculateScore(1, 0);
    component.calculateScore(1, 1);
    component.calculateScore(1, 2);
    component.calculateScore(1, 3);
    expect(component.scores[0][0]).toEqual(-5);
    expect(component.scores[0][1]).toEqual(15);
    expect(component.scores[0][2]).toEqual(-10);
    expect(component.scores[0][3]).toEqual(20);
    expect(component.scores[1][0]).toEqual(5);
    expect(component.scores[1][1]).toEqual(undefined);
    expect(component.scores[1][2]).toEqual(undefined);
    expect(component.scores[1][3]).toEqual(undefined);
  });

  it("should open bet dialog", () => {
    component.openDialog(ScoreType.BET, 3, 2);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });

  it("should open achieved dialog", () => {
    dialogRefSpy.afterClosed.and.returnValue(of({name:"Player1", type: ScoreType.ACHIEVED}));
    component.openDialog(ScoreType.ACHIEVED, 3, 2);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });

  it("should open score and do nothing if no result is returned", () => {
    dialogRefSpy.afterClosed.and.returnValue(of(undefined));
    component.openDialog(ScoreType.ACHIEVED, 3, 2);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });

  it("should show invalid bet for rounds between 5 and 5 when all bets equal round number", () => {
    component.bets = [[],[],[],[],[1, 2, 1, undefined]];
    component.setBet(4, 3, 1);
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it("shouldn't show invalid bet for rounds not between 5 and 5 when all bets equal round number", () => {
    component.bets = [[],[],[],[1, 1, 1, undefined],[]];
    component.setBet(3, 3, 1);
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it("should't show invalid bet for rounds between 5 and 5 when all bets don't equal round number", () => {
    component.bets = [[],[],[],[],[1, 2, 1, undefined]];
    component.setBet(4, 3, 2);
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });
});
