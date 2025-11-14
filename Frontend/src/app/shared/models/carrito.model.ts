/**
 * Modelo para la entidad carrito y la parte de detalle_carrito
 */
export interface CarritoConDetalles{
    id_carrito: string;
    id_usuario: string;
    detalles?: DetalleCarritoOut[];   
    subtotal_general: number;
    activo: boolean;
    fecha_crea: string;
    fecha_actual?: string;
}
export interface DetalleCarritoOut{
    id_detalle: string;
    id_producto: string;
    nombre_producto: string;
    cantidad: number;
    precio_producto: number;
    subtotal: number;
}

export interface CreateCarritoRequest{
    id_usuario: string;
    activo: boolean;
}

export interface CreateDetalle_carritoRequest{
    id_carrito: string;
    id_producto: string;
    cantidad: number;
}

export interface UpdateDetalle_carritoRequest{
    id_detalle?: string;
    id_producto?: string;
    cantidad?: number;
}

/**
 * Modelos para los filtros en carrito y detalle_carrito
 */
export interface CarritoFilters {
    id_carrito?: string;
    id_usuario?: string;
    activo?: boolean; // Status filter
}

export interface Detalle_carritoFilters{
    id_detalle?: string;
}

/**
 * Modelo para respuesta paginada de carritos y detalles_carritos
 */
export interface CarritoListResponse {
  data: CarritoConDetalles[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  size: number;
}
