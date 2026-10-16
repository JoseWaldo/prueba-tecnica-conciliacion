import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ColumnFilter, FlexRender, injectTable } from '@tanstack/angular-table';
import { COLUMNAS_NUMERICAS } from '../../constants/conciliacion.constants';
import { Filtro, ResultadoConciliacion } from '../../models/conciliacion.model';
import { ConciliacionService } from '../../services/conciliacion.service';
import { ToastService } from '../../services/toast.service';
import { numero } from '../../utils/format';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { RadioCardComponent } from '../radio-card/radio-card.component';
import { columns, features } from './table.config';

@Component({
  selector: 'app-conciliacion',
  imports: [CommonModule, FlexRender, FileUploadComponent, RadioCardComponent],
  templateUrl: './conciliacion.component.html',
  styleUrl: './conciliacion.component.scss',
})
export class ConciliacionComponent {
  private service = inject(ConciliacionService);
  private toast = inject(ToastService);

  readonly numero = numero;

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

  setFiltro(f: string): void {
    const filtro = f as Filtro;
    this.columnFilters.set(filtro === 'Todas' ? [] : [{ id: 'estado', value: filtro }]);
  }

  onBusqueda(event: Event): void {
    this.globalFilter.set((event.target as HTMLInputElement).value);
  }

  onFile(file: File | null, tipo: 'facturas' | 'contabilidad'): void {
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
        this.toast.success(
          'Conciliación completada',
          `${r.resumen.total_facturas} facturas · ${r.resumen.facturas_correctas} correctas · ${r.resumen.facturas_con_inconsistencia} con inconsistencia`
        );
      },
      error: () => {
        this.cargando.set(false);
        this.toast.error(
          'Error al procesar',
          'No se pudo completar la conciliación. Verifica que el backend esté disponible.'
        );
      },
    });
  }
}
