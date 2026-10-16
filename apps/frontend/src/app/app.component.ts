import { Component } from '@angular/core';
import { ConciliacionComponent } from './components/conciliacion/conciliacion.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [ConciliacionComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
