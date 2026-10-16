import { Component, input } from '@angular/core';

@Component({
  selector: 'app-estado-badge',
  template: `
    <span class="badge" [class.badge--bad]="estado() === 'Con inconsistencia'">
      {{ estado() }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-block;
      padding: 2px 10px;
      font-weight: 700;
      color: var(--color-fg);
      background: var(--color-secondary);
      border-radius: var(--radius-full);
      white-space: nowrap;
    }

    .badge--bad {
      background: var(--color-accent);
    }
  `,
})
export class EstadoBadgeComponent {
  readonly estado = input('');
}
