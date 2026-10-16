import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  ColumnDef,
  ColumnFilter,
  FlexRender,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_equalsString,
  flexRenderComponent,
  globalFilteringFeature,
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table';
import { EstadoBadgeComponent } from './estado-badge.component';
import {
  ConciliacionService,
  DetalleFactura,
  ResultadoConciliacion,
} from './services/conciliacion.service';

type Filtro = 'Todas' | 'Correcta' | 'Con inconsistencia';

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const numero = (valor: unknown): string => (valor as number).toLocaleString('es-CO');

const columns: ColumnDef<typeof features, DetalleFactura>[] = [
  { accessorKey: 'id_factura', header: 'Factura' },
  { accessorKey: 'nit_proveedor', header: 'NIT' },
  { accessorKey: 'fecha_factura', header: 'Fecha' },
  { accessorKey: 'concepto', header: 'Concepto' },
  { accessorKey: 'base_gravable', header: 'Base', cell: ({ getValue }) => numero(getValue()) },
  { accessorKey: 'valor_iva', header: 'IVA', cell: ({ getValue }) => numero(getValue()) },
  { accessorKey: 'valor_retencion', header: 'Retención', cell: ({ getValue }) => numero(getValue()) },
  { accessorKey: 'total_factura', header: 'Total', cell: ({ getValue }) => numero(getValue()) },
  {
    accessorKey: 'estado',
    header: 'Estado',
    filterFn: filterFn_equalsString,
    cell: ({ getValue }) =>
      flexRenderComponent(EstadoBadgeComponent, { inputs: { estado: getValue() as string } }),
  },
  {
    accessorKey: 'inconsistencias',
    header: 'Inconsistencias',
    cell: ({ getValue }) => (getValue() as string[]).join(', '),
  },
];

@Component({
  selector: 'app-root',
  imports: [CommonModule, FlexRender],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private service = inject(ConciliacionService);

  filtros: Filtro[] = ['Todas', 'Correcta', 'Con inconsistencia'];

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

  readonly numColumns = new Set(['base_gravable', 'valor_iva', 'valor_retencion', 'total_factura']);

  esNum(id: string): boolean {
    return this.numColumns.has(id);
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
