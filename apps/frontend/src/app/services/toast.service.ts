import { Injectable, signal } from '@angular/core';
import { Toast, ToastInput } from '../models/toast.model';

const DEFAULT_DURATION = 6000;
const LEAVE_DURATION = 200;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private static counter = 0;

  readonly toasts = signal<Toast[]>([]);

  show(input: ToastInput): number {
    const id = ++ToastService.counter;
    this.toasts.update((list) => [...list, { id, leaving: false, ...input }]);

    const duration = input.duration ?? DEFAULT_DURATION;
    if (duration > 0) {
      setTimeout(() => this.close(id), duration);
    }

    return id;
  }

  success(title: string, message?: string): number {
    return this.show({ type: 'success', title, message });
  }

  error(title: string, message?: string): number {
    return this.show({ type: 'error', title, message });
  }

  info(title: string, message?: string): number {
    return this.show({ type: 'info', title, message });
  }

  warning(title: string, message?: string): number {
    return this.show({ type: 'warning', title, message });
  }

  close(id: number): void {
    if (!this.toasts().some((t) => t.id === id)) return;

    this.toasts.update((list) =>
      list.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );

    setTimeout(() => {
      this.toasts.update((list) => list.filter((t) => t.id !== id));
    }, LEAVE_DURATION);
  }

  clear(): void {
    this.toasts.set([]);
  }
}
