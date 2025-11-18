/**
 * Vuelta para los servicios de factura
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    FacturaFilters,
    FacturaListResponse,
    RespuestaFactura
} from '../../shared/models/factura.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({providedIn: 'root'})
export class FacturaService {
    private readonly facturaEndpoint = '/facturas'

    constructor(private apiService: ApiService) { }

    getFacturas(pagination: PaginationParams, filters?: FacturaFilters): Observable<FacturaListResponse> {
        const params : any = {
            page: pagination.page,
            limit: pagination.limit
        };

        if(filters) {
            if(filters.id_usuario) params.id_usuario = filters.id_usuario;
            if(filters.activo !== undefined) params.activo = filters.activo;
        }
        return this.apiService.get<FacturaListResponse>(this.facturaEndpoint, { params })
    }

    generateFactura(factura: { id_carrito: string, metodo_pago: string }): Observable<RespuestaFactura> {
    return this.apiService.post<RespuestaFactura>(`${this.facturaEndpoint}/${factura.id_carrito}`, { metodo_pago: factura.metodo_pago });
    }   


    disableFactura(id_factura: string): Observable<RespuestaFactura> {
        return this.apiService.patch<RespuestaFactura>(`${this.facturaEndpoint}/${id_factura}`, {activo : false})
    }

}