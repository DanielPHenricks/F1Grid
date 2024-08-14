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
    this.gridNumbers = [
      { number: 0, isFilter: true, filterCriteria: '' },
      { number: 0, isFilter: true, filterCriteria: 'Has won a race' },
      { number: 0, isFilter: true, filterCriteria: 'Podium finish' },
      { number: 0, isFilter: true, filterCriteria: 'Pole position' },
      { number: 0, isFilter: true, filterCriteria: 'Fastest lap' },
      ...Array.from({length: 3}, (_, i) => ({ number: i + 1 })),
      { number: 0, isFilter: true, filterCriteria: 'Drove for Ferrari'},
      ...Array.from({length: 3}, (_, i) => ({ number: i + 4 })),
      { number: 0, isFilter: true, filterCriteria: 'Drove for Mercedes'},
      ...Array.from({length: 3}, (_, i) => ({ number: i + 7 })),
    ];
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
  applyFilter(filterItem: GridItem): void {
    console.log(`Filter applied: ${filterItem.filterCriteria}`);
    // Implement your filter logic here
  }
}

