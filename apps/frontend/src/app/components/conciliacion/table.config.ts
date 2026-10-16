import {
  ColumnDef,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_equalsString,
  flexRenderComponent,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table';
import { DetalleFactura } from '../../models/conciliacion.model';
import { numero } from '../../utils/format';
import { EstadoBadgeComponent } from '../estado-badge/estado-badge.component';

export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export const columns: ColumnDef<typeof features, DetalleFactura>[] = [
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
