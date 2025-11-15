/**
 * Modelos para la entidad factura
 */


export interface DetalleFacturaRespuesta{
    nombre_producto: string;
    cantidad: number;
    precio_producto: number;
    subtotal?: number;
}   

export interface RespuestaFactura {
    id_factura: string;
    id_usuario: string;
    id_carrito: string;
    activo: boolean;
    metodo_pago: string;
    subtotal_total: number;
    descuento?: number;
    total: number;
    fecha_creacion: string; // string porque llega como ISO
    detalles: DetalleFacturaRespuesta[];
}

export interface CreateFactura{
    id_usuario: string;
    id_carrito: string;
    metodo_pago: string;
}

/**
 * Modelos para los filtros en factura
 */
export interface FacturaFilters{
    id_usuario?: string;
    metodo_pago?: string;
    activo?: boolean;
}

/**
 * Modelo para respuesta paginada de las facturas
 */

export interface FacturaListResponse{
    data: RespuestaFactura[]
    totalPages: number;
    currentPage: number;
    totalItems: number;
    size: number;
}