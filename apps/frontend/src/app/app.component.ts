import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  ColumnDef,
  FlexRender,
  flexRenderComponent,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table';
import { EstadoBadgeComponent } from './estado-badge.component';
import {
  ConciliacionService,
  DetalleFactura,
  ResultadoConciliacion,
} from './services/conciliacion.service';

type Filtro = 'Todas' | 'Correcta' | 'Con inconsistencia';

const features = tableFeatures({});

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
  filtro = signal<Filtro>('Todas');

  facturas: File | null = null;
  contabilidad: File | null = null;

  cargando = signal(false);
  error = signal('');
  resultado = signal<ResultadoConciliacion | null>(null);

  readonly detalleFiltrado = computed<DetalleFactura[]>(() => {
    const r = this.resultado();
    if (!r) return [];
    return this.filtro() === 'Todas'
      ? r.detalle
      : r.detalle.filter((d) => d.estado === this.filtro());
  });

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.detalleFiltrado(),
  }));

  readonly numColumns = new Set(['base_gravable', 'valor_iva', 'valor_retencion', 'total_factura']);

  esNum(id: string): boolean {
    return this.numColumns.has(id);
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
