from collections import Counter
from dataclasses import asdict

from domain.constants import (
    ESTADO_CORRECTA,
    ESTADO_INCONSISTENTE,
    MENSAJE_CAMPOS_VACIOS,
    MENSAJE_DUPLICADA,
    MENSAJE_IVA,
    MENSAJE_SIN_REGISTRO,
    MENSAJE_TOTAL,
)
from services.csv_reader import leer_contabilidad, leer_facturas, validar_archivo


def conciliar(facturas, contabilidad) -> dict:
    validar_archivo(facturas, "facturas")
    validar_archivo(contabilidad, "contabilidad")

    facturas = leer_facturas(facturas.read())
    ids_contables = leer_contabilidad(contabilidad.read())
    conteo = Counter(f.id_factura for f in facturas)

    detalle = []
    for f in facturas:
        causas = []

        if not f.nit_proveedor or not f.fecha_factura or not f.concepto:
            causas.append(MENSAJE_CAMPOS_VACIOS)

        iva_esperado = round(f.base_gravable * f.tarifa_iva, 2)
        if round(f.valor_iva, 2) != iva_esperado:
            causas.append(MENSAJE_IVA)

        total_esperado = round(f.base_gravable + iva_esperado - f.valor_retencion, 2)
        if round(f.total_factura, 2) != total_esperado:
            causas.append(MENSAJE_TOTAL)

        if conteo[f.id_factura] > 1:
            causas.append(MENSAJE_DUPLICADA)

        if f.id_factura not in ids_contables:
            causas.append(MENSAJE_SIN_REGISTRO)

        detalle.append(
            {
                **asdict(f),
                "estado": ESTADO_INCONSISTENTE if causas else ESTADO_CORRECTA,
                "inconsistencias": causas,
            }
        )

    total = len(facturas)
    inconsistentes = sum(1 for d in detalle if d["estado"] == ESTADO_INCONSISTENTE)

    return {
        "resumen": {
            "total_facturas": total,
            "facturas_correctas": total - inconsistentes,
            "facturas_con_inconsistencia": inconsistentes,
        },
        "detalle": detalle,
    }
