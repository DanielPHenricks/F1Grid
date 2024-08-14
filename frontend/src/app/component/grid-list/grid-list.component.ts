import {Component, inject, OnInit} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { SearchModalComponent } from "../search-modal/search-modal.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../services/api-client.service';
import { Driver } from '../../types/driver';
import { Constructor } from '../../types/constructor';
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
export class GridListComponent implements OnInit{

  isSelected: boolean = false
  selectedSquare: number = 0

  gridItems: GridItem[] = [];
  constructors: Constructor[] = [];
  dialog: any = inject(MatDialog)
  readonly apiClient: ApiClientService

  public constructor(api: ApiClientService) {
    this.apiClient = api;
    this.gridItems = [
      { number: 0, type: 'blank'},
      { number: 1, type: 'filter', filterCriteria: 'Has won a race', isRowFilter: false, typeOfFilter: 'race_wins', minFilterQuantity: 1 },
      { number: 2, type: 'filter', filterCriteria: 'Podium finish', isRowFilter: false, typeOfFilter: 'race_podiums', minFilterQuantity: 1},
      { number: 3, type: 'filter', filterCriteria: 'Drove for McLaren', isRowFilter: false, typeOfFilter: 'constructor'},
      { number: 1, type: 'filter', filterCriteria: 'Drove for Mercedes', isRowFilter: true, typeOfFilter: 'constructor'},
      { number: 1, type: 'driver', row: 1, column: 1 },
      { number: 2, type: 'driver', row: 1, column: 2 },
      { number: 3, type: 'driver', row: 1, column: 3 },
      { number: 2, type: 'filter', filterCriteria: 'Drove for Ferrari', isRowFilter: true, typeOfFilter: 'constructor'},
      { number: 4, type: 'driver', row: 2, column: 1},
      { number: 5, type: 'driver', row: 2, column: 2},
      { number: 6, type: 'driver', row: 2, column: 3},
      { number: 3, type: 'filter', filterCriteria: 'Drove for Red Bull', isRowFilter: true, typeOfFilter: 'constructor'},
      { number: 7, type: 'driver', row: 3, column: 1},
      { number: 8, type: 'driver', row: 3, column: 2},
      { number: 9, type: 'driver', row: 3, column: 3},
    ];
  }

  // Host the constructor (team) data in the parent class and let the search modal handle the driver API calls.
  ngOnInit(): void {
    this.apiClient.getConstuctors().subscribe((ctrs: Constructor[]) => {
      this.constructors = ctrs;
    })
  }

  squareClick(id: number): void {
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
          const rowFilter = filters.filter((elem) => elem.isRowFilter && elem.number == item.row)[0]
          const columnFilter = filters.filter((elem) => !elem.isRowFilter && elem.number == item.column)[0]
          if(rowFilter.typeOfFilter === 'constructor'){
            
          }
          else {

          }

          if(columnFilter.typeOfFilter === 'constructor'){

          }
          else {

          }

          item.driverName = `${driver.forename} ${driver.surname}`;
        }
      }
    });
  }

  /**
   * Checks to see if the parameter driver has ever driven for the team constructor.
   * @param driver The driver guessed by the player.
   * @param constructor The constructor specified by the filter. Currently, a simple equality is checked. In the future,
   * implementing a DFS of some sort to check parent teams could be viable. 
   * Ex: consider the team history Benneton -> Renault -> Lotus -> Renault -> Alpine, where X -> Y implies a name change from X to Y.
   * @returns True if the driver has raced for the constructor in at least one race; false otherwise.
   */
  checkConstructorValid(driver: Driver, constructor: Constructor): boolean {
    this.apiClient.getResults(driver).subscribe((res: any) => {
      console.log(res)
    });
    return true;
  }
}

