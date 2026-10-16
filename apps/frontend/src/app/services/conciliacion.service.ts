import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Resumen {
  total_facturas: number;
  facturas_correctas: number;
  facturas_con_inconsistencia: number;
}

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
  estado: 'Correcta' | 'Con inconsistencia';
  inconsistencias: string[];
}

export interface ResultadoConciliacion {
  resumen: Resumen;
  detalle: DetalleFactura[];
}

@Injectable({ providedIn: 'root' })
export class ConciliacionService {
  private http = inject(HttpClient);

  conciliar(facturas: File, contabilidad: File): Observable<ResultadoConciliacion> {
    const form = new FormData();
    form.append('facturas', facturas);
    form.append('contabilidad', contabilidad);
    return this.http.post<ResultadoConciliacion>('/api/conciliacion', form);
  }
}
