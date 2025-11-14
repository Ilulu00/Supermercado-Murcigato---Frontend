/**
 * Modelo para la entidad Proveedor
 */
export interface Proveedor {
    id_proveedor: string; // UUID
    id: string; // Alias for id_proveedor for frontend compatibility
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    telefono?: string;
    correo: string;
    fecha_creacion: string;
    fecha_edicion?: string;
}

/**
 * Modelo para crear una nuevo proveedor
 */
export interface CreateProveedorRequest {
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    telefono?: string;
    correo: string;
}

/**
 * Modelo para actualizar un proveedor
 */
export interface UpdateProveedorRequest {
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    telefono?: string;
    correo?: string;
}

/**
 * Modelo para filtros de proveedores
 */
export interface ProveedorFilters {
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    correo?: string;
}

/**
 * Modelo para respuesta paginada de categorías
 */
export interface ProveedorListResponse {
    data: Proveedor[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}
