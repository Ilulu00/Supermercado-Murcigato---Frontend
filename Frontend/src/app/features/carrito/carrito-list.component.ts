import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationParams } from '../../core/models/api-response.model';
import { CarritoService } from '../../core/services/carrito.service';
import { FacturaService } from '../../core/services/factura.service';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoConDetalles, CarritoFilters, CreateCarritoRequest, UpdateDetalle_carritoRequest } from '../../shared/models/carrito.model';
import { CreateFactura } from '../../shared/models/factura.model';
import { Producto } from '../../shared/models/producto.model';

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
    productos: Producto[] = [];

    filters: CarritoFilters = {};

    //Al parecer son propiedades de los modales
    showModal = false;
    editingCarrito: CarritoConDetalles | null = null;
    carritoForm: FormGroup;

    constructor(
        private carritoService: CarritoService,
        private facturaService: FacturaService,
        private productoService: ProductoService,
        private fb: FormBuilder
    ) {      this.carritoForm = this.fb.group({
            id_usuario: [''],
            activo: [true],
            detalles: this.fb.array([
            ]) as FormArray
        });
    }
    
    ngOnInit(): void {
        this.loadCarritos();
       /**  this.productoService.getProductos().subscribe(data => {
            this.productos = data;
        });*/
    }

    get detalles(): FormArray {
        return this.carritoForm.get('detalles') as FormArray<FormGroup>;
    }

    loadCarritos() {
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
        this.loadCarritos();
    }

    clearFilters(): void{
        this.filters = {};
        this.currentPage = 1;
        this.loadCarritos();
    }

    goToPage(page: number): void {
        if(page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadCarritos();
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
                    id_detalle: [det.id_detalle],
                    cantidad: [det.cantidad],
                    precio_producto: [det.precio_producto],
                    subtotal: [det.cantidad * det.precio_producto]
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

        if(this.editingCarrito) {
            //aqui ya se abre pa editar cada detalle
            const detalles = this.detalles.value;

            detalles.forEach((det: any) => {
                const updateData: UpdateDetalle_carritoRequest = {
                    id_producto: det.id_producto,
                    cantidad: det.cantidad
                };
                
                this.carritoService.updateDetalle_carrito(det.id_detalle, updateData).subscribe();
            });
            this.loadCarritos();
            this.closeModal();
        } else {
            //entra por aqui por si no hay carritos creados :v
            const newCarrito: CreateCarritoRequest = {
                id_usuario: formValue.id_usuario,
                activo: formValue.activo
            };

            this.carritoService.createCarrito(newCarrito).subscribe({
                next: () => {
                    this.loadCarritos();
                    this.closeModal()
                },
                error: (err) => {
                    console.log('Hubo un error al crear el carrito: ', err);
                    alert('Perdon, hubo un error al crear su carrito de compras');
                }
            });
        }
    }

    eliminarDetalle(index: number): void {
        const detalle = this.detalles.at(index)?.value;

        if(!detalle?.id_detalle) {
            this.detalles.removeAt(index);
            return;
        }

        if(confirm('¿Estas seguro/a de eliminar el producto de tu carrito?')) {
            this.carritoService.deleteDetalle_carrito(detalle.id_detalle).subscribe({
                next: () => this.detalles.removeAt(index),
                error: (err) => console.log('Erorr, eliminando detalle: ', err)
            });
        }
    }

    updateSubtotal(index: number): void {
        const detalleForm = this.detalles.at(index);

        const cantidad = detalleForm.get('cantidad')?.value || 0;
        const precio = detalleForm.get('precio_producto')?.value || 0;

        const subtotal = cantidad * precio;

        detalleForm.patchValue({ subtotal });
    }

    agregarDetalle(): void {
        this.detalles.push(
            this.fb.group({
                id_producto: [''],
                cantidad: [1],
                precio_producto: [0],
                subtotal: [0]
            })
        )
    }

/*    onSelectProducto(index: number): void {
        const detalleForm = this.detalles.at(index);

        const id_producto = detalleForm.get('id_producto')?.value;
        const productoSeleccionado = this.productos.find(p => p.id_producto === id_producto);

        if (productoSeleccionado) {
            detalleForm.patchValue({
                precio_producto: productoSeleccionado.precio_producto
            });
            this.updateSubtotal(index); 
        }
    }
*/
    desactivarCarrito(carrito: CarritoConDetalles): void {
        this.carritoService.disableCarrito(carrito.id_carrito).subscribe({
            next: () => {
                this.loadCarritos();
            },
            error: (err) => {
                console.log('Hubo un error al desactivar el carrito: ', err);
                alert('Error al desactivar el carrito.')
            }
        });
    }

    pagarCarrito(carrito: CarritoConDetalles): void {
        const nuevaFactura: CreateFactura = {
            id_carrito: String(carrito.id_carrito),
            id_usuario: String(carrito.id_usuario), 
            metodo_pago: '',
            subtotal: 0.0,
            descuento: 0.0,
            total: 0.0
        };
        

        this.facturaService.generateFactura(nuevaFactura).subscribe({
            next: (factura) => {
                console.log('factura generada: ', factura);
                this.loadCarritos();
                alert('Su factura se genero correctamente.');
            },
            error: (err) => {
                console.log('Error al generar la factura: ', err);
                alert('No se puedo realizar su factura.');
            }
        });
    }


}          






