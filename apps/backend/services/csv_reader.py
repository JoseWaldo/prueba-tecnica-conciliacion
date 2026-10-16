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
        raise ValidacionError(
            "No pudimos leer el archivo. Verifica que esté en formato CSV con "
            "codificación UTF-8."
        )

    filas = list(csv.DictReader(io.StringIO(texto)))
    if not filas:
        raise ValidacionError("El archivo está vacío. Por favor, sube un archivo que contenga datos.")

    faltantes = cabeceras - set(filas[0].keys())
    if faltantes:
        raise ValidacionError(
            f"El archivo no tiene todas las columnas requeridas. Faltan: {', '.join(sorted(faltantes))}."
        )

    return filas


def validar_archivo(archivo, nombre: str) -> None:
    if archivo is None:
        raise ValidacionError(
            f"No se recibió el archivo de {nombre}. Por favor, adjúntalo y vuelve a intentarlo."
        )
    if not (archivo.filename or "").lower().endswith(".csv"):
        raise ValidacionError(
            f"El archivo de {nombre} debe ser un CSV con extensión .csv. "
            "Revisa el archivo que seleccionaste."
        )


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
