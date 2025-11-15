import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUsuarioRequest, UpdateUsuarioRequest, Usuario, UsuarioFilters, UsuarioListResponse } from '../../shared/models/usuario.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly endpoint = '/usuarios';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los usuarios con paginación
   */
  getUsuarios(pagination: PaginationParams, filters?: UsuarioFilters): Observable<UsuarioListResponse> {
    const params : any = {
      page: pagination.page,
      limit: pagination.limit
    };

    if(filters) {
      if(filters.correo) params.correo= filters.correo;
      if(filters.primer_nombre) params.primer_nombre = filters.primer_nombre;
      if(filters.segundo_nombre) params.segundo_nombre = filters.segundo_nombre;
      if(filters.primer_apellido) params.primer_apellido = filters.primer_apellido;
      if(filters.segundo_apellido) params.segundo_apellido = filters.segundo_apellido;
      if(filters.activo !== undefined) params.activo = filters.activo;
        }
    return this.apiService.get<UsuarioListResponse>(this.endpoint, { params } );
  }

  
  /**
   * Obtiene un usuario por ID
   */
  getUsuarioById(id_usuario: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id_usuario}`);
  }

  /**
   * Obtiene un usuario por email
   */
  getUsuarioByEmail(correo: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/correo/${correo}`);
  }

  /**
   * Crea un nuevo usuario
   */
  createUsuario(usuario: CreateUsuarioRequest): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, usuario);
  }

  /**
   * Actualiza un usuario existente
   */
  updateUsuario(id_usuario: string, usuario: UpdateUsuarioRequest): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id_usuario}`, usuario);
  }

  /**
   * Desactiva un usuario (soft delete)
   */
  desactivarUsuario(id_usuario: string): Observable<Usuario> {
    return this.apiService.patch<Usuario>(`${this.endpoint}/${id_usuario}/desactivar`, {});
  }

  /**
   * Obtiene todos los usuarios administradores
   */
  getUsuariosAdmin(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(`${this.endpoint}/admin/lista`);
  }

  /**
   * Verifica si un usuario es administrador
   */
  verificarEsAdmin(id_usuario: string): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/${id_usuario}/es-admin`);
  }
}
