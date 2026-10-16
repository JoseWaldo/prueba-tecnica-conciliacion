import csv
import io
from collections import Counter
from dataclasses import asdict

from models import Factura


def _num(valor: str) -> float:
    return float(valor.strip() or 0)


def _leer_facturas(contenido: bytes) -> list[Factura]:
    filas = csv.DictReader(io.StringIO(contenido.decode("utf-8-sig")))
    return [
        Factura(
            id_factura=r["id_factura"].strip(),
            nit_proveedor=r["nit_proveedor"].strip(),
            fecha_factura=r["fecha_factura"].strip(),
            concepto=r["concepto"].strip(),
            base_gravable=_num(r["base_gravable"]),
            tarifa_iva=_num(r["tarifa_iva"]),
            valor_iva=_num(r["valor_iva"]),
            tarifa_retencion=_num(r["tarifa_retencion"]),
            valor_retencion=_num(r["valor_retencion"]),
            total_factura=_num(r["total_factura"]),
        )
        for r in filas
    ]


def _leer_contabilidad(contenido: bytes) -> set[str]:
    filas = csv.DictReader(io.StringIO(contenido.decode("utf-8-sig")))
    return {r["id_factura"].strip() for r in filas}


def conciliar(facturas_csv: bytes, contabilidad_csv: bytes) -> dict:
    facturas = _leer_facturas(facturas_csv)
    ids_contables = _leer_contabilidad(contabilidad_csv)
    conteo = Counter(f.id_factura for f in facturas)

    detalle = []
    for f in facturas:
        causas = []

        if not f.nit_proveedor or not f.fecha_factura or not f.concepto:
            causas.append("Campos obligatorios vacíos")

        iva_esperado = round(f.base_gravable * f.tarifa_iva, 2)
        if round(f.valor_iva, 2) != iva_esperado:
            causas.append("IVA no coincide con base x tarifa")

        total_esperado = round(f.base_gravable + iva_esperado - f.valor_retencion, 2)
        if round(f.total_factura, 2) != total_esperado:
            causas.append("Total no coincide con base + IVA - retención")

        if conteo[f.id_factura] > 1:
            causas.append("Factura duplicada")

        if f.id_factura not in ids_contables:
            causas.append("Factura sin registro contable")

        detalle.append(
            {
                **asdict(f),
                "estado": "Con inconsistencia" if causas else "Correcta",
                "inconsistencias": causas,
            }
        )

    total = len(facturas)
    inconsistentes = sum(1 for d in detalle if d["estado"] == "Con inconsistencia")

    return {
        "resumen": {
            "total_facturas": total,
            "facturas_correctas": total - inconsistentes,
            "facturas_con_inconsistencia": inconsistentes,
        },
        "detalle": detalle,
    }
