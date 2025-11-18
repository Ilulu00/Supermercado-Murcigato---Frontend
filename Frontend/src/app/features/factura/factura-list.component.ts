import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationParams } from '../../core/models/api-response.model';
import { FacturaService } from '../../core/services/factura.service';
import { ProductoService } from '../../core/services/producto.service';
import { FacturaFilters, RespuestaFactura } from '../../shared/models/factura.model';
import { Producto } from '../../shared/models/producto.model';

@Component({
    selector: 'app-factura-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './factura-list.component.html',
    styleUrl: './factura-list.component.scss'
})
export class FacturaListComponent implements OnInit {

    facturas: RespuestaFactura[] = [];
    loading = false;
    currentPage = 1;
    totalPages = 1;
    pageSize = 10;
    productos: Producto[] = [];
    filters: FacturaFilters = {};

    showModal = false;
    editingFactura: RespuestaFactura | null = null;
    facturaForm: FormGroup;

    constructor(
        private facturaService: FacturaService,
        private productoService: ProductoService,
        private fb: FormBuilder
    ) {
        this.facturaForm = this.fb.group({
            id_usuario: [''],
            id_carrito: [''],
            metodo_pago: [''],
            subtotal_total: 0,
            descuento: 0,
            total: 0,
            fecha_creacion: [new Date().toISOString()],
            activo: [true],
            detalles: this.fb.array([]) 
        });
    }

    ngOnInit(): void {
        this.loadFacturas();

        // Cargar productos para mostrarlos en detalles si se requiere
        const pagination = { page: 0, limit: 9999 };
        this.productoService.getProductos(pagination, {}).subscribe((resp: any) => {
            this.productos = resp?.data ?? [];
        });
    }

    get detalles(): FormArray {
        return this.facturaForm.get('detalles') as FormArray;
    }

    addDetalle(det?: any): void {
        this.detalles.push(
            this.fb.group({
                id_producto: [det?.id_producto ?? ''],
                cantidad: [det?.cantidad ?? 1],
                precio_producto: [det?.precio_producto ?? 0],
                subtotal: [det?.subtotal ?? 0],
            })
        );
    }

    clearDetalles(): void {
        this.detalles.clear();
    }

    loadFacturas(): void {
        this.loading = true;

        const pagination: PaginationParams = {
            page: this.currentPage,
            limit: this.pageSize
        };

        this.facturaService.getFacturas(pagination, this.filters).subscribe({
            next: (resp) => {
                this.facturas = resp.data;
                this.totalPages = resp.totalPages;
                this.currentPage = resp.currentPage;
                this.loading = false;
            },
            error: (err) => {
                console.log('Error al cargar las facturas: ', err);
                this.loading = false;
            }
        });
    }

    onFilterChange(): void {
        this.currentPage = 1;
        this.loadFacturas();
    }

    clearFilters(): void {
        this.filters = {};
        this.currentPage = 1;
        this.loadFacturas();
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadFacturas();
        }
    }

    openCreateModal(): void {
        this.editingFactura = null;
        this.showModal = true;

        this.facturaForm.reset({
            id_usuario: '',
            id_carrito: '',
            metodo_pago: '',
            subtotal_total: 0,
            descuento: 0,
            total: 0,
            fecha_creacion: new Date().toISOString(),
            activo: true
        });

        this.clearDetalles();
        this.addDetalle(); 
    }

    closeModal(): void {
        this.showModal = false;
        this.editingFactura = null;
        this.facturaForm.reset();
        this.clearDetalles();
    }

    cargarFacturaEnModal(factura: RespuestaFactura): void {
        this.showModal = true;
        this.editingFactura = factura;

        this.facturaForm.patchValue({
            id_usuario: factura.id_usuario,
            id_carrito: factura.id_carrito,
            metodo_pago: factura.metodo_pago,
            subtotal_total: factura.subtotal_total,
            descuento: factura.descuento,
            total: factura.total,
            fecha_creacion: factura.fecha_creacion,
            activo: factura.activo
        });

        this.clearDetalles();

        factura.detalles.forEach(det => this.addDetalle(det));
    }

    getNombreProducto(id_producto: string): string {
        const p = this.productos.find(prod => prod.id_producto === id_producto);
        return p?.nombre_producto ?? '—';
}

}