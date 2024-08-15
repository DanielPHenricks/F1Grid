import {Component, inject, OnInit} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { SearchModalComponent } from "../search-modal/search-modal.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../services/api-client.service';
import { Driver } from '../../types/driver';
import { Constructor } from '../../types/constructor';
import { GridItem, DriverGridItem } from '../../types/grid_item';
import { Result } from '../../types/result';

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
      { number: 3, type: 'filter', filterCriteria: 'Drove for McLaren', isRowFilter: false, typeOfFilter: 'constructor', constructor_name: 'McLaren'},
      { number: 1, type: 'filter', filterCriteria: 'Drove for Mercedes', isRowFilter: true, typeOfFilter: 'constructor', constructor_name: 'Mercedes'},
      { number: 1, type: 'driver', row: 1, column: 1 },
      { number: 2, type: 'driver', row: 1, column: 2 },
      { number: 3, type: 'driver', row: 1, column: 3 },
      { number: 2, type: 'filter', filterCriteria: 'Drove for Ferrari', isRowFilter: true, typeOfFilter: 'constructor', constructor_name: 'Ferrari'},
      { number: 4, type: 'driver', row: 2, column: 1},
      { number: 5, type: 'driver', row: 2, column: 2},
      { number: 6, type: 'driver', row: 2, column: 3},
      { number: 3, type: 'filter', filterCriteria: 'Drove for Red Bull', isRowFilter: true, typeOfFilter: 'constructor', constructor_name: 'Red Bull'},
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
          const filters = this.gridItems.filter((elem) => elem.type === 'filter');
          const rowFilter = filters.filter((elem) => elem.isRowFilter && elem.number == item.row)[0];
          const columnFilter = filters.filter((elem) => !elem.isRowFilter && elem.number == item.column)[0];
          
          let rowValidPromise: Promise<boolean> = Promise.resolve(true);
          let columnValidPromise: Promise<boolean> = Promise.resolve(true);
  
          if (rowFilter.typeOfFilter === 'constructor') {
            const matchingConstructor = this.constructors.filter((elem) => elem.constructor_name === rowFilter.constructor_name)[0];
            rowValidPromise = this.checkConstructorValid(driver, matchingConstructor);
          }
          else {

          }

          if (columnFilter.typeOfFilter === 'constructor') {
            const matchingConstructor = this.constructors.filter((elem) => elem.constructor_name === columnFilter.constructor_name)[0];
            columnValidPromise = this.checkConstructorValid(driver, matchingConstructor);
          }
          else {

          }

          Promise.all([rowValidPromise, columnValidPromise])
            .then(([rowValid, columnValid]) => {
              const isValid = rowValid && columnValid; // Both the row and the column must be correct.
              if (isValid) { // Update the driver name in the grid box.
                item.driverName = `${driver.forename} ${driver.surname}`;
              }
            });
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
   * @returns A Promise that resolves to true if the driver has raced for the constructor in at least one race; false otherwise.
   */
  async checkConstructorValid(driver: Driver, constructor: Constructor): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.apiClient.getResults(driver).subscribe((res: Result[]) => {
        const validEntries = res.filter((elem) => elem.constructor_id === constructor.constructor_id);
        resolve(validEntries.length > 0);
      });
    });
  }
  checkResultsValid(driver: Driver, typeOfFilter: string, minFilterQuantity: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.apiClient.getResults(driver).subscribe((res: Result[]) => {
        const driverRaces = res.filter((elem) => elem.driver_id === driver.driver_id);
        if(typeOfFilter === 'race_wins'){
          resolve(driverRaces.filter((elem) => elem.position_text === "1").length > minFilterQuantity)
        }
        if(typeOfFilter === 'race_podiums'){
          resolve(driverRaces.filter((elem) => {
            elem.position_text === "1" ||
            elem.position_text === "2" ||
            elem.position_text === "3"
        }).length >= minFilterQuantity)
        }
      })
    })
  }
}

