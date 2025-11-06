import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationParams } from '../../core/models/api-response.model';
import { CarritoService } from '../../core/services/carrito.service';
import { CarritoConDetalles, CarritoFilters, UpdateDetalle_carritoRequest } from '../../shared/models/carrito.model';

@Component({
    selector: 'app-carrito-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './carrito-list.component.html',
    styleUrl: './carrito-list.component.scss'
})
export class CarritoListComponent implements OnInit {
    carritos: CarritoConDetalles[] = [];
    id_carrito!: CarritoConDetalles["id_carrito"];
    loading = false;
    currentPage = 1; 
    totalPages = 1;
    pageSize = 10;

    filters: CarritoFilters = {};

    //Al parecer son propiedades de los modales
    showModal = false;
    editingCarrito: CarritoConDetalles | null = null;
    carritoForm: FormGroup;

    constructor(
        private carritoService: CarritoService,
        private fb: FormBuilder
    ) {      this.carritoForm = this.fb.group({
            id_usuario: [''],
            activo: [true],
            detalles: this.fb.array([

            ]) as FormArray
        });
    }
    
    ngOnInit(): void {
        this.loadCarrito();
    }

    get detalles(): FormArray {
        return this.carritoForm.get('detalles') as FormArray<FormGroup>;
    }

    loadCarrito() {
        this.loading = true;
        const pagination: PaginationParams ={
            page: this.currentPage,
            limit: this.pageSize 
        };

        this.carritoService.getCarritos(pagination, this.filters).subscribe({
            next: (carritos) => {
                this.carritos = carritos;
                this.loading = false;
        },
        error: (err) => {
            console.log('Lo siento, pero hubo un error al cargar los carritos: ', err);
            //esto de aqui es para por si no esta disponible el backend, se usen datos mock
            if(err.status === 0 || err.status === undefined) {
                console.log('Backend no disponible, se usaran datos mock para carrito. Perdone las moelstias');
                this.carritos = [{
                    id_carrito: 'afea1-fafaf4-f1dnu-q2wsf5',
                    id_usuario: '28edjj-afoje2-afiqf2-fofq1',
                    id_detalle: '13ews3-13esfh7-3sa-f1f321',
                    id_producto: 'faf095-495jf-40fkla0-013',
                    cantidad: 5,
                    activo: true,
                    fecha_crea: new Date().toISOString(),
                    fecha_actual: new Date().toISOString()
                }];
                this.totalPages = 1;
            }
            this.loading = false;
        }
    });
    }

    onfilterChange(): void{
        this.currentPage = 1;
        this.loadCarrito();
    }

    clearFilters(): void{
        this.filters = {};
        this.currentPage = 1;
        this.loadCarrito();
    }

    goToPage(page: number): void {
        if(page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadCarrito();
        }
    }

    openCreateModal(): void {
        this.editingCarrito = null;
        this.carritoForm.reset({
            id_detalle: '',
            id_producto: '',
            cantidad: 0
        });
        this.showModal = true;
    }

    editCarritoYDetalles(CarritoYDetalles: CarritoConDetalles): void {
        this.editingCarrito = CarritoYDetalles;
        this.carritoForm.patchValue({
            id_usuario: CarritoYDetalles.id_usuario,
            activo: CarritoYDetalles.activo
        });
        this.detalles.clear();
        CarritoYDetalles.detalles?.forEach(det =>{
            this.detalles.push(
                this.fb.group({
                    id_producto: [det.id_producto],
                    cantidad: [det.cantidad],
                    precio: [det.precio_producto]
                })
            );
        });
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.carritoForm.markAllAsTouched();
        return;
    }

    saveCarrito(): void {
        if(this.carritoForm.invalid) {
            this.carritoForm.markAllAsTouched();
            return;
        }

        const formValue = this.carritoForm.value;

        if (this.editingCarrito) {
            //actualizar los detalles del producto
            const updateData: UpdateDetalle_carritoRequest = {
                id_producto: formValue.id_producto,
                cantidad: formValue.cantidad
            };
        }



}          





}
