import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  ConciliacionService,
  DetalleFactura,
  ResultadoConciliacion,
} from './services/conciliacion.service';

type Filtro = 'Todas' | 'Correcta' | 'Con inconsistencia';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private service = inject(ConciliacionService);

  filtros: Filtro[] = ['Todas', 'Correcta', 'Con inconsistencia'];
  filtro = signal<Filtro>('Todas');

  facturas: File | null = null;
  contabilidad: File | null = null;

  cargando = signal(false);
  error = signal('');
  resultado = signal<ResultadoConciliacion | null>(null);

  get detalle(): DetalleFactura[] {
    const r = this.resultado();
    if (!r) return [];
    return this.filtro() === 'Todas'
      ? r.detalle
      : r.detalle.filter((d) => d.estado === this.filtro());
  }

  onFile(event: Event, tipo: 'facturas' | 'contabilidad'): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (tipo === 'facturas') this.facturas = file;
    else this.contabilidad = file;
  }

  procesar(): void {
    if (!this.facturas || !this.contabilidad) {
      this.error.set('Selecciona los dos archivos CSV (facturas y contabilidad).');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.resultado.set(null);

    this.service.conciliar(this.facturas, this.contabilidad).subscribe({
      next: (r) => {
        this.resultado.set(r);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(
          'No se pudo procesar. Verifica que el backend esté corriendo en http://localhost:5000.'
        );
        this.cargando.set(false);
      },
    });
  }
}
