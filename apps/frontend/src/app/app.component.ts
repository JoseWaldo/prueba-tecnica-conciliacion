import { Component } from '@angular/core';
import { ConciliacionComponent } from './components/conciliacion/conciliacion.component';

@Component({
  selector: 'app-root',
  imports: [ConciliacionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
