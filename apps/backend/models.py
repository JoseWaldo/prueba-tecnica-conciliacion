from dataclasses import dataclass


@dataclass
class Factura:
    id_factura: str
    nit_proveedor: str
    fecha_factura: str
    concepto: str
    base_gravable: float
    tarifa_iva: float
    valor_iva: float
    tarifa_retencion: float
    valor_retencion: float
    total_factura: float
