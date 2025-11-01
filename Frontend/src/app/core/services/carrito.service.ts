/**
 * Vuelta para los servicios de carrito
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    Carrito,
    CarritoFilters
} from '../../shared/models/carrito.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({providedIn: 'root'})
export class CarritoService{
    private readonly endpoint = '/carritos';

    constructor(private apiService: ApiService) { }

    getCarritos(pagination: PaginationParams, filters?: CarritoFilters):
    Observable<Carrito[]> {
        return this.apiService.getPaginated<Carrito>(this.endpoint, pagination, filters);
    }

    getCarritoById(id: string): Observable<Carrito> {
        return this.apiService.get<Carrito>(`${this.endpoint}/${id}`);
    }

    disableCarrito(id: string): Observable<Carrito> {
        return this.apiService.delete<Carrito>(`${this.endpoint}/${id}`)
    }
}

