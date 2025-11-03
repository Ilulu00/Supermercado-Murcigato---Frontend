/**
 * Modelos para la entidad factura
 */

export interface Factura{
    id_factura: string; //Este es el uuid de la factura
    id_usuario: string;
    id_carrito: string;
    metodo_pago: string;
    subtotal: number;
    descuento: number;
    total: number;
    fecha_creacion: string;
    activo: boolean;
}

export interface CreateFactura{
    id_usuario: string;
    id_carrito: string;
    metodo_pago: string;
    subtotal: number; 
    descuento: number;
    total: number;
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
data: Factura[]
  totalPages: number;
  currentPage: number;
  totalItems: number;
}