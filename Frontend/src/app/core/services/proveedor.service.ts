import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProveedorRequest, Proveedor, ProveedorFilters, ProveedorListResponse, UpdateProveedorRequest } from '../../shared/models/proveedor.models';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ProveedorService {
    private readonly proveedorEndpoint = '/proveedor';

    constructor(private apiService: ApiService) { }

    /**
     * Obtiene todos los proveedores con paginación
     */
    getProveedores(pagination: PaginationParams, filters?: ProveedorFilters): Observable<ProveedorListResponse> {
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
        }
        return this.apiService.get<ProveedorListResponse>(this.proveedorEndpoint, { params })
    }

    /**
     * Obtiene un proveedor por ID
     */
    getProveedorById(id: string): Observable<Proveedor> {
        return this.apiService.get<Proveedor>(`${this.proveedorEndpoint}/${id}`);
    }

    /**
     * Crea un nuevo proveedor
     */
    createProveedor(proveedor: CreateProveedorRequest): Observable<Proveedor> {
        return this.apiService.post<Proveedor>(this.proveedorEndpoint, proveedor);
    }

    /**
     * Actualiza un proveedor existente
     */
    updateProveedor(id: string, proveedor: UpdateProveedorRequest): Observable<Proveedor> {
        return this.apiService.put<Proveedor>(`${this.proveedorEndpoint}/${id}`, proveedor);
    }

    /**
     * Obtiene proveedor por correo
     */
    getProveedorByCorreo(correo: string): Observable<Proveedor[]> {
        return this.apiService.get<Proveedor[]>(`${this.proveedorEndpoint}/proveedor/${correo}`);
    }

}
