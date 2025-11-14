/**
 * Vuelta para los servicios de carrito
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationParams } from '../../core/models/api-response.model';
import {
    CarritoConDetalles,
    CarritoFilters, CarritoListResponse, CreateCarritoRequest, CreateDetalle_carritoRequest,
    DetalleCarritoOut,
    UpdateDetalle_carritoRequest
} from '../../shared/models/carrito.model';
import { ApiService } from './api.service';

@Injectable({providedIn: 'root'})
export class CarritoService{ 
    private readonly endpoint = '/carritos';
    private readonly detalleEndpoint = '/detalles_carrito';

    constructor(private apiService: ApiService) { }

    getCarritos(pagination: PaginationParams, filters?: CarritoFilters):
    Observable<CarritoListResponse> {
        const params : any = {
            page: pagination.page,
            limit: pagination.limit
        };

        if(filters) {
            if(filters.id_carrito) params.id_carrito = filters.id_carrito;
            if(filters.id_usuario) params.id_usuario = filters.id_usuario;
            if(filters.activo !== undefined) params.activo = filters.activo;
        }
        return this.apiService.get<CarritoListResponse>(this.endpoint, {params});
    }

    getCarritoById(id_carrito: string): Observable<CarritoConDetalles> {
        return this.apiService.get<CarritoConDetalles>(`${this.endpoint}/${id_carrito}`);
    }

    disableCarrito(id_carrito: string): Observable<CarritoConDetalles> {
        return this.apiService.patch<CarritoConDetalles>(`${this.endpoint}/${id_carrito}`, {activo : false})
    }

    enableCarrito(id_carrito: string): Observable<CarritoConDetalles> {
        return this.apiService.patch<CarritoConDetalles>(`${this.endpoint}/${id_carrito}`, {activo: true})
    }

    createCarrito(carrito: CreateCarritoRequest): Observable<CarritoConDetalles> {
        return this.apiService.post<CarritoConDetalles>(this.endpoint, carrito)
    }

    getDetalles_Carrito(id_carrito: string): Observable<DetalleCarritoOut[]> {
        return this.apiService.get<DetalleCarritoOut[]>(`${this.detalleEndpoint}/${id_carrito}`)
    }


    createDetalle_carrito(detalle: CreateDetalle_carritoRequest ): Observable<DetalleCarritoOut> {
        return this.apiService.post<DetalleCarritoOut>(this.detalleEndpoint, detalle)
    }

    deleteDetalle_carrito(id_detalle: string): Observable<DetalleCarritoOut> { 
        return this.apiService.delete<DetalleCarritoOut>(`${this.detalleEndpoint}/${id_detalle}`)
    }

    updateDetalle_carrito(id_detalle: string, detalle: UpdateDetalle_carritoRequest): Observable<DetalleCarritoOut>{
        return this.apiService.put<DetalleCarritoOut>(`${this.detalleEndpoint}/${id_detalle}`, detalle)
    }
    
}


