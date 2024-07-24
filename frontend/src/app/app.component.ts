import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridListComponent } from './component/grid-list/grid-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GridListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
