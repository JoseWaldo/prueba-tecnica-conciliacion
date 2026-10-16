import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResultadoConciliacion } from '../models/conciliacion.model';

@Injectable({ providedIn: 'root' })
export class ConciliacionService {
  private http = inject(HttpClient);

  conciliar(facturas: File, contabilidad: File): Observable<ResultadoConciliacion> {
    const form = new FormData();
    form.append('facturas', facturas);
    form.append('contabilidad', contabilidad);
    return this.http.post<ResultadoConciliacion>(`${environment.apiUrl}/api/conciliacion`, form);
  }
}
