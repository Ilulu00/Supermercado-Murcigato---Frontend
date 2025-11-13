/**
 * Vuelta para los servicios de factura
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    CreateFactura,
    Factura,
    FacturaFilters
} from '../../shared/models/factura.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({providedIn: 'root'})
export class FacturaService {
    private readonly facturaEndpoint = '/facturas'

    constructor(private apiService: ApiService) { }

    getFacturas(pagination: PaginationParams, filters?: FacturaFilters): Observable<Factura[]> {
        return this.apiService.getPaginated<Factura>(this.facturaEndpoint, pagination, filters)
    }

    generateFactura(factura: CreateFactura): Observable<Factura> {
        return this.apiService.post<Factura>(this.facturaEndpoint, factura)
    }

    disableFactura(id_factura: string): Observable<Factura> {
        return this.apiService.patch<Factura>(`${this.facturaEndpoint}/${id_factura}`, {activo : false})
    }

}