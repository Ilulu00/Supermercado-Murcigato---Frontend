/**
 * Modelo para la entidad carrito y la parte de detalle_carrito
 */

export interface Carrito{
    id_carrito: string; //Este es el uuid
    id_usuario: string; //Este es el uuid del usuario al q le pertence el carrito
    activo: boolean;
    fecha_crea: string;
    fecha_actual?: string;
}

export interface Detalle_carrito{
    id_detalle: string; //Este es el uuid del detalle
    id_carrito: string;
    id_producto: string;
    cantidad: number;
    precio_producto: number;
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

export interface CarritoConDetalles{
    id_carrito: string;
    id_usuario: string;
    id_detalle: string; //Este es el uuid del detalle
    id_producto: string;
    cantidad: number;
    detalles?: Detalle_carrito[];   
    activo: boolean;
    fecha_crea: string;
    fecha_actual?: string;
}

/**
 * Modelo para respuesta paginada de carritos y detalles_carritos
 */
export interface CarritoListResponse {
  data: Carrito[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface Detalle_carritoListResponse{
    data: Detalle_carrito[]
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
