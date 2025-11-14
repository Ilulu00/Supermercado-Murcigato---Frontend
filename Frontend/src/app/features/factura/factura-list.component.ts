import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationParams } from '../../core/models/api-response.model';
import { FacturaService } from '../../core/services/factura.service';
import { FacturaFilters, RespuestaFactura } from '../../shared/models/factura.model';

@Component({
    selector: 'app-factura-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './factura-list-component.html',
    styleUrl: './factura-list-component.scss'
})
export class FacturaListComponent implements OnInit{
    facturas: RespuestaFactura[] = [];
    loading = false;
    currentPage = 1;
    totalPages = 1;
    pageSize = 10;

    filters: FacturaFilters = {};

    //propiedades del modal
    showModal = false;
    editingFactura: RespuestaFactura | null = null;
    facturaForm: FormGroup;

    constructor(
        private facturaService: FacturaService,
        private fb: FormBuilder
    )  {
        this.facturaForm = this.fb.group({ 
            id_usuario: [''],
            id_carrito: [''],
            metodo_pago: [''],
            subtotal: 0.0,
            descuento: 0.0,
            total: 0.0,
            activo: true
        });
    }

    ngOnInit(): void {
        this.loadFacturas();
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
        },
            error: (err) =>{
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
        if (page > 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadFacturas();
        }
    }

    openCreateModal(): void {
        this.editingFactura = null;
        this.facturaForm.reset({
            id_factura: ''
        })
    }












}