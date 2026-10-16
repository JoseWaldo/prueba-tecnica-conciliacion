import { Component, inject } from '@angular/core';
import { Toast } from '../../models/toast.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  private readonly service = inject(ToastService);

  readonly toasts = this.service.toasts;

  close(toast: Toast): void {
    this.service.close(toast.id);
  }
}
