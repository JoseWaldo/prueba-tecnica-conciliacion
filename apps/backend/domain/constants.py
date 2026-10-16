CABECERAS_FACTURAS = {
    "id_factura", "nit_proveedor", "fecha_factura", "concepto", "base_gravable",
    "tarifa_iva", "valor_iva", "tarifa_retencion", "valor_retencion", "total_factura",
}
CABECERAS_CONTABILIDAD = {
    "id_factura", "fecha_contabilizacion", "cuenta_contable", "centro_costo",
    "valor_debito", "valor_credito", "estado",
}

ESTADO_CORRECTA = "Correcta"
ESTADO_INCONSISTENTE = "Con inconsistencia"

MENSAJE_CAMPOS_VACIOS = "Campos obligatorios vacíos"
MENSAJE_IVA = "IVA no coincide con base x tarifa"
MENSAJE_TOTAL = "Total no coincide con base + IVA - retención"
MENSAJE_DUPLICADA = "Factura duplicada"
MENSAJE_SIN_REGISTRO = "Factura sin registro contable"
