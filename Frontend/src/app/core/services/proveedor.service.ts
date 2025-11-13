import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProveedorRequest, Proveedor, ProveedorFilters, UpdateProveedorRequest } from '../../shared/models/proveedor.models';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ProveedorService {
    private readonly endpoint = '/proveedor';

    constructor(private apiService: ApiService) { }

    /**
     * Obtiene todos los proveedores con paginación
     */
    getProveedor(pagination: PaginationParams, filters?: ProveedorFilters): Observable<Proveedor[]> {
        return this.apiService.getPaginated<Proveedor>(this.endpoint, pagination, filters);
    }

    /**
     * Obtiene un proveedor por ID
     */
    getProveedorById(id: string): Observable<Proveedor> {
        return this.apiService.get<Proveedor>(`${this.endpoint}/${id}`);
    }

    /**
     * Crea un nuevo proveedor
     */
    createProveedor(proveedor: CreateProveedorRequest): Observable<Proveedor> {
        return this.apiService.post<Proveedor>(this.endpoint, proveedor);
    }

    /**
     * Actualiza un proveedor existente
     */
    updateProveedor(id: string, proveedor: UpdateProveedorRequest): Observable<Proveedor> {
        return this.apiService.put<Proveedor>(`${this.endpoint}/${id}`, proveedor);
    }

    /**
     * Obtiene proveedor por correo
     */
    getProveedorByCorreo(correo: string): Observable<Proveedor[]> {
        return this.apiService.get<Proveedor[]>(`${this.endpoint}/proveedor/${correo}`);
    }

}
