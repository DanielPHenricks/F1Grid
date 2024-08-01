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
  searchQuery = new FormControl('')
  driverOptions: Set<string>;
  filteredOptions?: Observable<string[]>;
  api: ApiClientService

  constructor(public dialogRef: MatDialogRef<SearchModalComponent>, api: ApiClientService) {
    this.api = api;
    this.driverOptions = new Set<string>;
  }

  ngOnInit() {
    this.filteredOptions = this.searchQuery.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.api.getPlayers().subscribe((data: any) => {
      data.forEach((elem: any) => {
        this.driverOptions.add(elem.forename + " " + elem.surname)
      });
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return [...this.driverOptions].filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSearch(): void {
    this.dialogRef.close(this.searchQuery.value);
  }
}
