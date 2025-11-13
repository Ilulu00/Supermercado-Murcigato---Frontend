/**
 * Modelo para la entidad Producto
 */
export interface Producto {
  id_producto: string; // UUID
  id: string; // Alias for id_producto for frontend compatibility
  nombre_producto: string;
  precio_producto: number;
  stock: number;
  id_categoria: string; // UUID
  id_proveedor: string; // UUID
  categoria?: { // Optional relationship data
    nombre: string;
  };
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

/**
 * Modelo para crear un nuevo producto
 */
export interface CreateProductoRequest {
  nombre_producto: string;
  precio_producto: number;
  stock: number;
  id_categoria: string;
  id_proveedor: string;
}

/**
 * Modelo para actualizar un producto
 */
export interface UpdateProductoRequest {
  nombre_producto?: string;
  precio_producto?: number;
  stock?: number;
  id_categoria?: string;
  id_proveedor?: string;
}

/**
 * Modelo para filtros de productos
 */
export interface ProductoFilters {
  nombre_producto?: string;
  id_categoria?: string;
  precio_min?: number;
  precio_max?: number;
  stock_min?: number;
}

/**
 * Modelo para respuesta paginada de productos
 */
export interface ProductoListResponse {
  data: Producto[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
