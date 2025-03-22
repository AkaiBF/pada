import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-players-dialog',
  imports: [MatDialogModule, MatIconModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './players-dialog.component.html',
  styles: ``
})
export class PlayersDialogComponent {
  dialogPlayers: string[] = [];

  newPlayer: string = "";

  addPlayer(): void {
    this.dialogPlayers.push(this.newPlayer);
    this.newPlayer = "";
  }
}
