import {Component, inject} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { SearchModalComponent } from "../search-modal/search-modal.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../services/api-client.service';
import { Driver } from '../../types/driver';
import { GridItem, FilterGridItem, DriverGridItem } from '../../types/grid_item';

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
  
  gridItems: GridItem[] = [];
  dialog: any = inject(MatDialog)
  readonly apiClient: ApiClientService

  public constructor(api: ApiClientService) {
    this.apiClient = api;
    this.gridItems = [
      { number: 0, type: 'filter', filterCriteria: '', isRowFilter: false},
      { number: 1, type: 'filter', filterCriteria: 'Has won a race', isRowFilter: false },
      { number: 2, type: 'filter', filterCriteria: 'Podium finish', isRowFilter: false  },
      { number: 3, type: 'filter', filterCriteria: 'Pole position', isRowFilter: false  },
      { number: 1, type: 'filter', filterCriteria: 'Drove for Mercedes', isRowFilter: true  },
      { number: 1, type: 'driver', row: 1, column: 1 },
      { number: 2, type: 'driver', row: 1, column: 2 },
      { number: 3, type: 'driver', row: 1, column: 3 },
      { number: 2, type: 'filter', filterCriteria: 'Drove for Ferrari', isRowFilter: true  },
      { number: 4, type: 'driver', row: 2, column: 1},
      { number: 5, type: 'driver', row: 2, column: 2},
      { number: 6, type: 'driver', row: 2, column: 3},
      { number: 3, type: 'filter', filterCriteria: 'Drove for Red Bull', isRowFilter: true  },
      { number: 7, type: 'driver', row: 3, column: 1},
      { number: 8, type: 'driver', row: 3, column: 2},
      { number: 9, type: 'driver', row: 3, column: 3},
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
        const index = this.gridItems.findIndex(item => item.number === id && item.type === 'driver');
        if (index !== -1) {
          const item = this.gridItems[index] as DriverGridItem;
          const filters = this.gridItems.filter((elem) => elem.type === 'filter')
          const rowFilter = filters.filter((elem) => elem.isRowFilter && elem.number == item.row)[0].filterCriteria
          const columnFilter = filters.filter((elem) => !elem.isRowFilter && elem.number == item.column)[0].filterCriteria
          console.log(rowFilter + " " + columnFilter)
          item.driverName = `${driver.forename} ${driver.surname}`;
        }
        this.apiClient.getResults(driver).subscribe((res: any) => {
          console.log(res);
        });
      }
    });
  }
}

