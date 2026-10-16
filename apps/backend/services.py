import csv
import io
from collections import Counter
from dataclasses import asdict

from models import Factura

CABECERAS_FACTURAS = {
    "id_factura", "nit_proveedor", "fecha_factura", "concepto", "base_gravable",
    "tarifa_iva", "valor_iva", "tarifa_retencion", "valor_retencion", "total_factura",
}
CABECERAS_CONTABILIDAD = {
    "id_factura", "fecha_contabilizacion", "cuenta_contable", "centro_costo",
    "valor_debito", "valor_credito", "estado",
}


class ValidacionError(Exception):
    """Error de validación de los archivos de entrada."""


def _num(valor: str) -> float:
    try:
        return float(valor.strip() or 0)
    except ValueError:
        return 0.0


def _leer_csv(contenido: bytes, cabeceras: set[str]) -> list[dict]:
    try:
        texto = contenido.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise ValidacionError("El archivo no es un CSV válido (codificación no soportada).")

    filas = list(csv.DictReader(io.StringIO(texto)))
    if not filas:
        raise ValidacionError("El archivo está vacío.")

    faltantes = cabeceras - set(filas[0].keys())
    if faltantes:
        raise ValidacionError(f"Columnas faltantes: {', '.join(sorted(faltantes))}.")

    return filas


def _leer_facturas(contenido: bytes) -> list[Factura]:
    filas = _leer_csv(contenido, CABECERAS_FACTURAS)
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
    filas = _leer_csv(contenido, CABECERAS_CONTABILIDAD)
    return {r["id_factura"].strip() for r in filas}


def _validar_archivo(archivo, nombre: str) -> None:
    if archivo is None:
        raise ValidacionError(f"Falta el archivo {nombre}.")
    if not (archivo.filename or "").lower().endswith(".csv"):
        raise ValidacionError(f"El archivo {nombre} debe ser un CSV (.csv).")


def conciliar(facturas, contabilidad) -> dict:
    _validar_archivo(facturas, "facturas")
    _validar_archivo(contabilidad, "contabilidad")

    facturas = _leer_facturas(facturas.read())
    ids_contables = _leer_contabilidad(contabilidad.read())
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
