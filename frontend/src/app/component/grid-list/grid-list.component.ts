import {Component, inject} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { SearchModalComponent } from "../search-modal/search-modal.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'grid-list',
  styleUrl: 'grid-list.component.css',
  templateUrl: 'grid-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule, 
    SearchModalComponent,
    MatDialogModule
  ],
})
export class GridListComponent {

  isSelected: boolean = false
  selectedSquare: number = 0
  gridNumbers: number[] = []
  dialog: any = inject(MatDialog)

  public constructor() {
    this.gridNumbers = Array.from({length:9}).map((x, i) => i+1)
  }

  squareClick(id: number): void {
    console.log("Square " + id + " was clicked.")
    this.selectedSquare = id
    this.isSelected = true
    this.openDialog()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SearchModalComponent)
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  
}