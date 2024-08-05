import {Component, inject} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { SearchModalComponent } from "../search-modal/search-modal.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../services/api-client.service';
import { Driver } from '../../types/driver';
import { GridItem } from '../../types/grid_item';

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
  
  gridNumbers: GridItem[] = [];
  dialog: any = inject(MatDialog)
  readonly apiClient: ApiClientService

  public constructor(api: ApiClientService) {
    this.apiClient = api;
    this.gridNumbers = Array.from({length: 9}, (_, i) => ({ number: i + 1 }));
  }

  squareClick(id: number): void {
    console.log("Square " + id + " was clicked.")
    this.selectedSquare = id
    this.isSelected = true
    this.openDialog(id)
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(SearchModalComponent);
    dialogRef.afterClosed().subscribe((driver: Driver) => {
      if (driver) {
        const index = this.gridNumbers.findIndex(item => item.number === id);
        if (index !== -1) {
          this.gridNumbers[index].driverName = `${driver.forename} ${driver.surname}`;
        }
        this.apiClient.getResults(driver).subscribe((res: any) => {
          console.log(res);
        });
      }
    });
  }
  
}
