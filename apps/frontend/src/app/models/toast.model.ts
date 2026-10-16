export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastInput {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface Toast extends ToastInput {
  id: number;
  leaving?: boolean;
}
