import csv
import io

from domain.constants import CABECERAS_CONTABILIDAD, CABECERAS_FACTURAS
from domain.errors import ValidacionError
from domain.models import Factura


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


def validar_archivo(archivo, nombre: str) -> None:
    if archivo is None:
        raise ValidacionError(f"Falta el archivo {nombre}.")
    if not (archivo.filename or "").lower().endswith(".csv"):
        raise ValidacionError(f"El archivo {nombre} debe ser un CSV (.csv).")


def leer_facturas(contenido: bytes) -> list[Factura]:
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


def leer_contabilidad(contenido: bytes) -> set[str]:
    filas = _leer_csv(contenido, CABECERAS_CONTABILIDAD)
    return {r["id_factura"].strip() for r in filas}
