/**
 * Modelo para la entidad Categoría
 */
export interface Categoria {
  id_categoria: string; // UUID
  nombre_categoria: string;
  descripcion?: string;
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

/**
 * Modelo para crear una nueva categoría
 */
export interface CreateCategoriaRequest {
  nombre_categoria: string;
  descripcion?: string;
  fecha_creacion: string;
}

/**
 * Modelo para actualizar una categoría
 */
export interface UpdateCategoriaRequest {
  nombre_categoria?: string;
  descripcion?: string;
  fecha_actualizacion: string;
}

/**
 * Modelo para filtros de categorías
 */
export interface CategoriaFilters {
  nombre_categoria?: string;
}

/**
 * Modelo para respuesta paginada de categorías
 */
export interface CategoriaListResponse {
  data: Categoria[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  size: number;
}
