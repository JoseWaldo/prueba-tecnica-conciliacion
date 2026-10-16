import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ColumnFilter, FlexRender, injectTable } from '@tanstack/angular-table';
import { COLUMNAS_NUMERICAS, FILTROS } from '../../constants/conciliacion.constants';
import { Filtro, ResultadoConciliacion } from '../../models/conciliacion.model';
import { ConciliacionService } from '../../services/conciliacion.service';
import { columns, features } from './table.config';

@Component({
  selector: 'app-conciliacion',
  imports: [CommonModule, FlexRender],
  templateUrl: './conciliacion.component.html',
  styleUrl: './conciliacion.component.scss',
})
export class ConciliacionComponent {
  private service = inject(ConciliacionService);

  filtros = FILTROS;

  facturas: File | null = null;
  contabilidad: File | null = null;

  cargando = signal(false);
  error = signal('');
  resultado = signal<ResultadoConciliacion | null>(null);

  readonly pagination = signal({ pageIndex: 0, pageSize: 10 });
  readonly globalFilter = signal('');
  readonly columnFilters = signal<ColumnFilter[]>([]);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.resultado()?.detalle ?? [],
    state: {
      pagination: this.pagination(),
      globalFilter: this.globalFilter(),
      columnFilters: this.columnFilters(),
    },
    onPaginationChange: (next) =>
      typeof next === 'function' ? this.pagination.update(next) : this.pagination.set(next),
    onGlobalFilterChange: (next) =>
      typeof next === 'function' ? this.globalFilter.update(next) : this.globalFilter.set(next),
    onColumnFiltersChange: (next) =>
      typeof next === 'function' ? this.columnFilters.update(next) : this.columnFilters.set(next),
  }));

  readonly filtro = computed<Filtro>(() => {
    const cf = this.columnFilters();
    return cf.length === 0 ? 'Todas' : (cf[0].value as Filtro);
  });

  readonly totalPaginas = computed(() => this.table.getPageCount());
  readonly puedeAnterior = computed(() => this.table.getCanPreviousPage());
  readonly puedeSiguiente = computed(() => this.table.getCanNextPage());

  esNum(id: string): boolean {
    return COLUMNAS_NUMERICAS.has(id);
  }

  setFiltro(f: Filtro): void {
    this.columnFilters.set(f === 'Todas' ? [] : [{ id: 'estado', value: f }]);
  }

  onBusqueda(event: Event): void {
    this.globalFilter.set((event.target as HTMLInputElement).value);
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
