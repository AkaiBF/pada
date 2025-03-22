import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from './routes/table/table.component';
import { PlayersDialogComponent } from './routes/dialogs/players-dialog/players-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [TableComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  players?: string[];

  private _dialog: MatDialog = inject(MatDialog);

  ngOnInit(): void {
    console.log("Opening")
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(PlayersDialogComponent, {
      width: '40vw',
      height: '50vh'
    });
    console.log(dialogRef)
    dialogRef.afterClosed().subscribe(result => {
      this.players = result;
    });
  }
}
