import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductoRequest, Producto, ProductoFilters, ProductoListResponse, UpdateProductoRequest } from '../../shared/models/producto.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly endpoint = '/productos';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los productos con paginación
   */
  getProductos(pagination: PaginationParams, filters: ProductoFilters): Observable<ProductoListResponse> {
    const params : any = {
            page: pagination.page,
            limit: pagination.limit
        };

        if(filters) {
            if(filters.id_categoria) params.id_categoria = filters.id_categoria;
            if(filters.nombre_producto) params.nombre_producto = filters.nombre_producto;
            if(filters.precio_max) params.precio_max = filters.precio_max;
            if(filters.precio_min) params.precio_min = filters.precio_min;
            if(filters.stock_min) params.stock_min = filters.stock_min;
        }
  return this.apiService.get<ProductoListResponse>(this.endpoint, { params });
}


  /**
   * Obtiene un producto por ID
   */
  getProductoById(id_producto: string): Observable<Producto> {
    return this.apiService.get<Producto>(`${this.endpoint}/${id_producto}`);
  }

  /**
   * Crea un nuevo producto
   */
  createProducto(producto: CreateProductoRequest): Observable<Producto> {
    return this.apiService.post<Producto>(this.endpoint, producto);
  }

  /**
   * Actualiza un producto existente
   */
  updateProducto(id_producto: string, producto: UpdateProductoRequest): Observable<Producto> {
    return this.apiService.put<Producto>(`${this.endpoint}/${id_producto}`, producto);
  }

  /**
   * Obtiene productos por categoría
   */
  getProductosByCategoria(id_categoria: string): Observable<Producto[]> {
    return this.apiService.get<Producto[]>(`${this.endpoint}/categoria/${id_categoria}`);
  }

  /**
   * Obtiene productos por usuario
   */
  getProductosByUsuario(id_usuario: string): Observable<Producto[]> {
    return this.apiService.get<Producto[]>(`${this.endpoint}/usuario/${id_usuario}`);
  }

  /**
   * Busca productos por nombre
   */
  buscarProductos(nombre_producto: string): Observable<Producto[]> {
    return this.apiService.get<Producto[]>(`${this.endpoint}/buscar/${nombre_producto}`);
  }

  /**
   * Actualiza el stock de un producto
   */
  actualizarStock(id_producto: string, nuevoStock: number): Observable<Producto> {
    return this.apiService.patch<Producto>(`${this.endpoint}/${id_producto}/stock`, { stock: nuevoStock });
  }
}
