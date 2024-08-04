// search-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialog, MatDialogActions, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiClientService } from '../../services/api-client.service';
import { Driver } from '../../types/driver';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css']
})

export class SearchModalComponent implements OnInit {
  searchQuery = new FormControl()
  driverOptions: Set<Driver>;
  filteredOptions?: Observable<Driver[]>;
  api: ApiClientService

  constructor(public dialogRef: MatDialogRef<SearchModalComponent>, api: ApiClientService) {
    this.api = api;
    this.driverOptions = new Set<Driver>;
  }

  ngOnInit() {
    this.filteredOptions = this.searchQuery.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.forename + ' ' + value?.surname),
      map(value => this._filter(value || ''))
    );
    this.api.getPlayers().subscribe((data: Driver[]) => {
      data.forEach((elem: Driver) => {
        this.driverOptions.add(elem)
      });
    })
  }
  // Maps drivers to strings
  displayMapping(driver: Driver): string{
    return driver && driver.forename && driver.surname 
    ? `${driver.forename} ${driver.surname}` 
    : ''
  }
  
  // Use a Map to only display unique drivers from autocomplete.
  private _filter(value: string): Driver[] {
    const filterValue = value.toLowerCase();
    const uniqueDrivers = new Map<string, Driver>();
    
    [...this.driverOptions].forEach((option: Driver) => {
      const driverName = `${option.forename} ${option.surname}`.toLowerCase();
      if (driverName.includes(filterValue)) {
        uniqueDrivers.set(driverName, option);
      }
    });
    // Returns the value set of the drivers and maps it back to an array.
    return Array.from(uniqueDrivers.values()); 
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSearch(): void {
    this.dialogRef.close(this.searchQuery.value);
  }
}
