export interface Resumen {
  total_facturas: number;
  facturas_correctas: number;
  facturas_con_inconsistencia: number;
}

export type EstadoFactura = 'Correcta' | 'Con inconsistencia';

export interface DetalleFactura {
  id_factura: string;
  nit_proveedor: string;
  fecha_factura: string;
  concepto: string;
  base_gravable: number;
  tarifa_iva: number;
  valor_iva: number;
  tarifa_retencion: number;
  valor_retencion: number;
  total_factura: number;
  estado: EstadoFactura;
  inconsistencias: string[];
}

export interface ResultadoConciliacion {
  resumen: Resumen;
  detalle: DetalleFactura[];
}

export type Filtro = 'Todas' | EstadoFactura;
