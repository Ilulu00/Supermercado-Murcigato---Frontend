import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { Proveedor, ProveedorFilters } from '../../../shared/models/proveedor.models';

@Component({
    selector: 'app-proveedor-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './proveedor-list.component.html',
    styleUrl: './proveedor-list.component.scss'
})
export class ProveedorListComponent implements OnInit {
    proveedores: Proveedor[] = [];
    loading = false;
    currentPage = 1;
    totalPages = 1;
    pageSize = 10;

    filters: ProveedorFilters = {};

    // Modal properties
    showModal = false;
    editingProveedor: Proveedor | null = null;
    proveedorForm = {
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        telefono: '',
        correo: '',
        fecha_creacion: new Date().toISOString()
    };

    constructor(private ProveedorService: ProveedorService) { }

    ngOnInit(): void {
        this.loadProveedor();
    }

    loadProveedor(): void {
        this.loading = true;
        const pagination: PaginationParams = {
            page: this.currentPage,
            limit: this.pageSize
        };

        this.ProveedorService.getProveedores(pagination, this.filters).subscribe({
            next: (resp) => {
                this.proveedores = resp.data,
                this.totalPages = resp.totalPages;
                this.currentPage = resp.currentPage;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar proveedores:', error);
                // Si el backend no está disponible, usar datos mock
                if (error.status === 0 || error.status === undefined) {
                    console.log('Backend no disponible, usando datos mock para proveedores');
                    this.proveedores = [{
                        id_proveedor: '1',
                        primer_nombre: 'flor',
                        segundo_nombre: 'Angel',
                        primer_apellido: 'Estrada',
                        segundo_apellido: 'Rojas',
                        telefono: '938190031',
                        correo: 'florecita42@gmail.com',
                        fecha_creacion: new Date().toISOString(),
                        fecha_edicion: new Date().toISOString()
                    }];
                    this.totalPages = 1;
                }
                this.loading = false;
            }
        });
    }

    onFilterChange(): void {
        this.currentPage = 1;
        this.loadProveedor();
    }

    clearFilters(): void {
        this.filters = {};
        this.currentPage = 1;
        this.loadProveedor();
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadProveedor();
        }
    }

    openCreateModal(): void {
        this.editingProveedor = null;
        this.proveedorForm = {
            primer_nombre: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            telefono: '',
            correo: '',
            fecha_creacion: new Date().toISOString()
        };
        this.showModal = true;
    }

    editProveedor(proveedor: Proveedor): void {
        this.editingProveedor = proveedor;
        this.proveedorForm = {
            primer_nombre: proveedor.primer_nombre,
            segundo_nombre: proveedor.segundo_nombre || '',
            primer_apellido: proveedor.primer_apellido,
            segundo_apellido: proveedor.segundo_apellido || '',
            telefono: proveedor.telefono || '',
            correo: proveedor.correo || '',
            fecha_creacion: proveedor.fecha_creacion
        };
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.editingProveedor = null;
        this.proveedorForm = {
            primer_nombre: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            telefono: '',
            correo: '',
            fecha_creacion: new Date().toISOString()
        };
    }

    saveProveedor(): void {
        if (!this.proveedorForm.primer_nombre.trim()) {
            alert('El primer nombre es requerido');
            return;
        }
        if (!this.proveedorForm.primer_apellido.trim()) {
            alert('El primer apellido es requerido');
            return;
        }
        if (!this.proveedorForm.correo.trim()) {
            alert('El correo es requerido');
            return;
        }

        if (this.editingProveedor) {
            // Actualizar proveedor existente
            const updateData = {
                primer_nombre: this.proveedorForm.primer_nombre,
                segundo_nombre: this.proveedorForm.segundo_nombre,
                primer_apellido: this.proveedorForm.primer_apellido,
                segundo_apellido: this.proveedorForm.segundo_apellido,
                telefono: this.proveedorForm.telefono,
                correo: this.proveedorForm.correo
            };

            this.ProveedorService.updateProveedor(this.editingProveedor.id_proveedor, updateData).subscribe({
                next: () => {
                    this.loadProveedor();
                    this.closeModal();
                },
                error: (error) => {
                    console.error('Error al actualizar proveedor:', error);
                    alert('Error al actualizar el proveedor');
                }
            });
        } else {
            // Crear nuevo proveedor
            const newProveedor = {
                primer_nombre: this.proveedorForm.primer_nombre,
                segundo_nombre: this.proveedorForm.segundo_nombre,
                primer_apellido: this.proveedorForm.primer_apellido,
                segundo_apellido: this.proveedorForm.segundo_apellido,
                telefono: this.proveedorForm.telefono,
                correo: this.proveedorForm.correo,
                fecha_creacion: this.proveedorForm.fecha_creacion
            };

            this.ProveedorService.createProveedor(newProveedor).subscribe({
                next: () => {
                    this.loadProveedor();
                    this.closeModal();
                },
                error: (error) => {
                    console.error('Error al crear proveedor:', error);
                    alert('Error al crear el proveedor');
                }
            });
        }
    }
}
