import { Filtro } from '../models/conciliacion.model';

export const FILTROS: Filtro[] = ['Todas', 'Correcta', 'Con inconsistencia'];

export const COLUMNAS_NUMERICAS = new Set<string>([
  'base_gravable',
  'valor_iva',
  'valor_retencion',
  'total_factura',
]);
