import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria, CategoriaFilters, CategoriaListResponse, CreateCategoriaRequest, UpdateCategoriaRequest } from '../../shared/models/categoria.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly endpoint = '/categorias';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todas las categorías con paginación
   */
  getCategorias(pagination: PaginationParams, filters?: CategoriaFilters): Observable<CategoriaListResponse> {
    const params : any = {
      page: pagination.page,
      limit: pagination.limit
    };

    if(filters) {
      if(filters.nombre_categoria) params.nombre_categoria= filters.nombre_categoria;
        }
    return this.apiService.get<CategoriaListResponse>(this.endpoint, { params } );
  }

  /**
   * Obtiene una categoría por ID
   */
  getCategoriaById(id_categoria: string): Observable<Categoria> {
    return this.apiService.get<Categoria>(`${this.endpoint}/${id_categoria}`);
  }

  /**
   * Crea una nueva categoría
   */
  createCategoria(categoria: CreateCategoriaRequest): Observable<Categoria> {
    return this.apiService.post<Categoria>(this.endpoint, categoria);
  }

  /**
   * Actualiza una categoría existente
   */
  updateCategoria(id_categoria: string, categoria: UpdateCategoriaRequest): Observable<Categoria> {
    return this.apiService.put<Categoria>(`${this.endpoint}/${id_categoria}`, categoria);
  }

  /**
   * Obtiene una categoría por nombre
   */
  getCategoriaByNombre(nombre_categoria: string): Observable<Categoria> {
    return this.apiService.get<Categoria>(`${this.endpoint}/nombre/${nombre_categoria}`);
  }
}
