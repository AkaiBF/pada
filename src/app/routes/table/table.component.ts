import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScoreDialogComponent } from '../dialogs/score-dialog/score-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ScoreType } from '../../core/enums/score-type.enum';

@Component({
  selector: 'app-table',
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  @Input({required: true}) players!: string[];
  rounds: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "8s", "8", "7", "6", "5", "4", "3", "2", "1"];

  bets: (number | undefined)[][] = [];
  achieved: (number | undefined)[][] = [];
  scores: (number | undefined)[][] = [];

  latestCell?: { round: number, player: number };
  nextCell?: { round: number, player: number } = { round: 0, player: 0 };

  dialog: MatDialog = inject(MatDialog);
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  ngOnInit() {
    this.bets = this.rounds.map(() => this.players.map(() => undefined));
    this.achieved = this.rounds.map(() => this.players.map(() => undefined));
    this.scores = this.rounds.map(() => this.players.map(() => undefined));
  }

  maxOfRound(round: number): number {
    let stringRound = this.rounds[round];
    stringRound = stringRound.replace("s", "");
    return parseInt(stringRound);
  }

  isActiveRound(round: number): boolean {
    return this.latestCell?.round === round;
  }

  setBet(round: number, player: number, bet: number) {

    this.bets[round][player] = bet;
    if (this.isLastPlayerOfRound(round, player) && round > 3 && round < 13) {
      const totalBetsOfRound = this.bets[round].reduce((acc, bet) => (acc || 0) + (bet!), 0);
      if (totalBetsOfRound === this.maxOfRound(round)) {
        this._snackBar.open("La apuesta de " + this.players[player] + " es inválida", "Close");
      }
    }
    if (!this.isFullRound(ScoreType.BET, round)) {
      this.nextCell = this.setNextCell(round, player);
    }
    this.latestCell = { round: round, player: player };
  }

  setAchieved(round: number, player: number, achieved: number) {
    this.achieved[round][player] = achieved;
    this.calculateScore(round, player);
    if (this.isFullRound(ScoreType.ACHIEVED, round)) {
      this.setNextRound(round);
    }
  }

  isFullRound(type: ScoreType, round: number): boolean {
    if (type === ScoreType.BET) {
      return this.bets[round].every(bet => bet !== undefined);
    } else {
      return this.achieved[round].every(achieved => achieved !== undefined);
    }
  }

  setNextRound(round: number): void {
    const nextPlayer = (round + 1) % this.players.length;
    this.nextCell = { round: round + 1, player: nextPlayer };
    this._snackBar.open("Empieza la ronda " + this.rounds[round + 1], "Close");
  }

  setNextCell(round: number, player: number): { round: number, player: number } {
    if (player === this.players.length - 1) {
      return { round: round, player: 0 };
    }
    return { round: round, player: player + 1 };
  }

  calculateScore(round: number, player: number) {
    const bet = this.bets[round][player];
    const achieved = this.achieved[round][player];
    let score = (round - 1 < 0) ? 0 : this.scores[round - 1][player]!;

    if (bet === undefined || achieved === undefined) {
      return;
    }
    if (bet === achieved) {
      score += 10;
      score += bet * 5;
    } else {
      score -= (Math.abs(bet - achieved) * 5);
    }
    this.scores[round][player] = score;
  }

  toggleAchievedModal(round: number, player: number): void {
    if(this.isActiveRound(round) && this.isFullRound(ScoreType.BET, round)){
      this.openDialog(ScoreType.ACHIEVED, round, player);
    }
  }

  toggleBetModal(round: number, player: number): void {
    if (this.isNextCell(round, player) || this.isLatestCell(round, player)) {
      this.openDialog(ScoreType.BET, round, player);
    }

  }

  openDialog(type: ScoreType, round: number, player: number): void {
    const dialogRef = this.dialog.open(ScoreDialogComponent, {
      data: { name: this.players[player], type: type },
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (type === ScoreType.BET) {
        this.setBet(round, player, result);
      } else {
        this.setAchieved(round, player, result);
      }
    });
  }

  isLatestCell(round: number, player: number): boolean {
    return this.latestCell?.round === round && this.latestCell?.player === player;
  }

  isNextCell(round: number, player: number): boolean {
    return this.nextCell?.round === round && this.nextCell?.player === player;
  }

  isStartingRound(round: number, player: number): boolean {
    return player === round % this.players.length;
  }

  isLastPlayerOfRound(round: number, player: number): boolean {
    if (round === 0) {
      return player === this.players.length - 1;
    }
    return player === ((round - 1) % this.players.length);
  }

  get widthClass(): string {
    const width = 11/this.players.length;
    return "w-" + Math.floor(width);
  }

  get totalWidth(): string {
    let singleWidth = Math.floor(11/this.players.length);
    return "w-" + ((singleWidth * this.players.length) + 1);
  }
}