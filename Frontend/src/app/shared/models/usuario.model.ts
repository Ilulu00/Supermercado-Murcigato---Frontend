/**
 * Modelo para la entidad Usuario
 */
export interface Usuario {
  id: string; // UUID
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  email: string;
  telefono?: string;
  activo: boolean;
  es_admin: boolean;
  fecha_creacion: string;
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
  email: string;
  contrasena: string;
  telefono?: string;
  es_admin?: boolean;
  password: string; // Alias for contraseña for frontend compatibility
}

/**
 * Modelo para actualizar un usuario
 */
export interface UpdateUsuarioRequest {
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  email?: string;
  telefono?: string;
  es_admin?: boolean;
  activo?: boolean;
}

/**
 * Modelo para cambiar contraseña
 */
export interface ChangePasswordRequest {
  contrasena_actual: string;
  nueva_contrasena: string;
}

/**
 * Modelo para filtros de usuarios
 */
export interface UsuarioFilters {
  email?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  activo?: boolean;
  es_admin?: boolean;
}