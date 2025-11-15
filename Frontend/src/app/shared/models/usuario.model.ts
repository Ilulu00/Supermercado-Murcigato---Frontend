/**
 * Modelo para la entidad Usuario
 */
export interface Usuario {
  id_usuario: string; // UUID
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo: string;
  telefono?: string;
  activo: boolean;
  es_admin: boolean;
  fecha_registro: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear un nuevo usuario
 */
export interface CreateUsuarioRequest {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo: string;
  telefono?: string;
  es_admin: boolean;
  activo: boolean;
  fecha_registro: string;
}

/**
 * Modelo para actualizar un usuario
 */
export interface UpdateUsuarioRequest {
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  correo?: string;
  telefono?: string;
  es_admin?: boolean;
  activo?: boolean;
}

/**
 * Modelo para filtros de usuarios
 */
export interface UsuarioFilters {
  correo?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  activo?: boolean;
  es_admin?: boolean;
}
export interface UsuarioListResponse {
  data: Usuario[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  size: number;
}
