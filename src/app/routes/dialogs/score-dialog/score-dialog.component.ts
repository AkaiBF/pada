import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ScoreType } from '../../../core/enums/score-type.enum';

@Component({
  selector: 'app-score-dialog',
  imports: [FormsModule, MatDialogModule, MatInputModule, MatButtonModule],
  templateUrl: './score-dialog.component.html'
})
export class ScoreDialogComponent implements OnInit{
  data?: number;

  public inputData: {name: string, type: ScoreType} = inject(MAT_DIALOG_DATA);
  name?: string;

  get type(): string {
    return this.inputData.type === ScoreType.BET ? 'Apuesta' : 'Conseguidas';
  }

  private _dialogRef: MatDialogRef<ScoreDialogComponent> = inject(MatDialogRef<ScoreDialogComponent>);

  ngOnInit(): void {
    this.name = this.inputData.name;
    setTimeout(() => {
      document.getElementById('score-input')?.focus();
    }, 180);
  }

  close(): void {
    this._dialogRef.close(this.data);
  }
}
