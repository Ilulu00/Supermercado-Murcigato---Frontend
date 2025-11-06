/**
 * Vuelta para los servicios de carrito
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationParams } from '../../core/models/api-response.model';
import {
    Carrito,
    CarritoConDetalles,
    CarritoFilters, CreateCarritoRequest, CreateDetalle_carritoRequest,
    Detalle_carrito,
    UpdateDetalle_carritoRequest
} from '../../shared/models/carrito.model';
import { ApiService } from './api.service';

@Injectable({providedIn: 'root'})
export class CarritoService{
    private readonly endpoint = '/carritos';
    private readonly detalleEndpoint = '/detalles_carrito';

    constructor(private apiService: ApiService) { }

    getCarritos(pagination: PaginationParams, filters?: CarritoFilters):
    Observable<CarritoConDetalles[]> {
        return this.apiService.getPaginated<CarritoConDetalles>(this.endpoint, pagination, filters);
    }

    getCarritoById(id_carrito: string): Observable<Detalle_carrito> {
        return this.apiService.get<Detalle_carrito>(`${this.endpoint}/${id_carrito}`);
    }

    disableCarrito(id_carrito: string): Observable<Carrito> {
        return this.apiService.patch<Carrito>(`${this.endpoint}/${id_carrito}`, {activo : false})
    }

    enableCarrito(id_carrito: string): Observable<Carrito> {
        return this.apiService.patch<Carrito>(`${this.endpoint}/${id_carrito}`, {activo: true})
    }

    createCarrito(carrito: CreateCarritoRequest): Observable<Carrito> {
        return this.apiService.post<Carrito>(this.endpoint, carrito)
    }

    getDetalles_Carrito(id_carrito: string): Observable<Detalle_carrito[]> {
        return this.apiService.get<Detalle_carrito[]>(`${this.detalleEndpoint}/${id_carrito}`)
    }


    createDetalle_carrito(detalle: CreateDetalle_carritoRequest ): Observable<Detalle_carrito> {
        return this.apiService.post<Detalle_carrito>(this.detalleEndpoint, detalle)
    }

    deleteDetalle_carrito(id_detalle: string): Observable<Detalle_carrito> { 
        return this.apiService.delete<Detalle_carrito>(`${this.detalleEndpoint}/${id_detalle}`)
    }

    updateDetalle_carrito(id_detalle: string, detalle: UpdateDetalle_carritoRequest): Observable<Detalle_carrito>{
        return this.apiService.put<Detalle_carrito>(`${this.detalleEndpoint}/${id_detalle}`, detalle)
    }
}


