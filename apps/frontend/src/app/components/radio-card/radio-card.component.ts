import { Component, EventEmitter, Output, computed, input } from '@angular/core';

type Accent = 'secondary' | 'primary' | 'accent' | 'none';

@Component({
  selector: 'app-radio-card',
  imports: [],
  templateUrl: './radio-card.component.html',
  styleUrl: './radio-card.component.scss',
})
export class RadioCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly actionLabel = input<string>();
  readonly accent = input<Accent>('secondary');
  readonly value = input.required<string>();
  readonly name = input.required<string>();
  readonly checked = input(false);
  readonly disabled = input(false);
  readonly showIndicator = input(true);
  readonly size = input<'md' | 'lg'>('md');

  @Output() readonly change = new EventEmitter<string>();
  @Output() readonly action = new EventEmitter<void>();

  readonly accentColor = computed<string>(() => {
    const colors: Record<Accent, string> = {
      secondary: 'var(--color-secondary)',
      primary: 'var(--color-primary)',
      accent: 'var(--color-accent)',
      none: 'transparent',
    };
    return colors[this.accent()];
  });

  onChange(): void {
    if (this.disabled()) return;
    this.change.emit(this.value());
  }

  onActionClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.action.emit();
  }
}
