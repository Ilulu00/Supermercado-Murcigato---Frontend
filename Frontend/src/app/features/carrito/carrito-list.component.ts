import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../core/models/api-response.model';
import { CarritoService } from '../../core/services/carrito.service';
import { FacturaService } from '../../core/services/factura.service';
import { ProductoService } from '../../core/services/producto.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { CarritoConDetalles, CarritoFilters, CreateCarritoRequest } from '../../shared/models/carrito.model';
import { Producto } from '../../shared/models/producto.model';
import { Usuario } from '../../shared/models/usuario.model';
@Component({
    selector: 'app-carrito-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './carrito-list.component.html',
    styleUrl: './carrito-list.component.scss'
})
export class CarritoListComponent implements OnInit {
    carritos: CarritoConDetalles[] = [];
    loading = false;
    currentPage = 1; 
    totalPages = 1;
    pageSize = 10;
    productos: Producto[] = [];
    filters: CarritoFilters = {};
    usuarios: Usuario[] = [];

    showModal = false;
    editingCarrito: CarritoConDetalles | null = null;
    carritoForm: FormGroup;

    constructor(
        private usuarioService: UsuarioService,
        private carritoService: CarritoService,
        private facturaService: FacturaService,
        private productoService: ProductoService,
        private fb: FormBuilder
    ) {
        // === Form principal ===
        this.carritoForm = this.fb.group({
            id_usuario: ['', Validators.required], // obligatorio
            activo: [true],
            detalles: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.loadCarritos();
        // Para cargar productos disponibles
        const pagination = { page: 0, limit: 9999 };
        this.productoService.getProductos(pagination, {}).subscribe((resp: any) => {
            this.productos = resp?.data ?? [];
        });
        //Para cargar los usuarios disponibles, para asi poder buscarlos por el correo
        this.usuarioService.getUsuarios(pagination, {}).subscribe((resp: any) => {
            this.usuarios = resp?.data ?? [];
        });
    }

    get detalles(): FormArray {
        return this.carritoForm.get('detalles') as FormArray<FormGroup>;
    }

    // === Carga de carritos ===
    loadCarritos() {
        this.loading = true;
        const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };

        this.carritoService.getCarritos(pagination, this.filters).subscribe({
            next: (response) => {
                this.carritos = response.data;
                this.totalPages = response.totalPages;
                this.currentPage = response.currentPage;
                this.loading = false;
            },
            error: (err) => {
                console.log('Error cargando carritos: ', err);
                this.loading = false;
            }
        });
    }

    onfilterChange(): void {
        this.currentPage = 1;
        this.loadCarritos();
    }

    clearFilters(): void {
        this.filters = {};
        this.currentPage = 1;
        this.loadCarritos();
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadCarritos();
        }
    }

    // === Modal: creación de carrito ===
    openCreateModal(): void {
        this.editingCarrito = null;
        this.carritoForm.reset({ 
            id_usuario: '', 
            activo: true });
        this.detalles.clear();
        this.agregarDetalle();
        this.showModal = true;
    }

    // === Modal: edición de carrito ===
    editCarritoYDetalles(carrito: CarritoConDetalles): void {
        this.editingCarrito = carrito;
        this.carritoForm.patchValue({
            id_usuario: carrito.id_usuario,
            activo: carrito.activo
        });
        this.detalles.clear();
        // Cargar detalles existentes
        carrito.detalles?.forEach(det => {
            this.detalles.push(this.fb.group({
                id_detalle: [det.id_detalle],
                id_producto: [det.id_producto, Validators.required],
                nombre_producto: [det.nombre_producto],
                cantidad: [det.cantidad, [Validators.required, Validators.min(1)]],
                precio_producto: [det.precio_producto, [Validators.required, Validators.min(0)]],
                subtotal: [det.cantidad * det.precio_producto]
            }));
        });
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.carritoForm.markAllAsTouched();
    }

    // === Guardar carrito ===
    saveCarrito(): void {
        if (this.carritoForm.invalid) {
            this.carritoForm.markAllAsTouched();
            return;
        }
        const formValue = this.carritoForm.value;

        if (this.editingCarrito) {
            // === Editar carrito existente ===
            const carrito = this.editingCarrito;
            const detalles = this.detalles.value;
            let pending = detalles.length;
            if (pending === 0) { this.loadCarritos(); this.closeModal(); return; }

            detalles.forEach((det: any) => {
                if (!det.id_detalle || det.id_detalle.lenght < 10) {
                    // Crear detalle nuevo
                    const newDetalle = { id_carrito: carrito.id_carrito, id_producto: det.id_producto, cantidad: det.cantidad };
                    this.carritoService.createDetalle_carrito(newDetalle).subscribe({
                        next: () => { pending--; if (pending === 0) { this.loadCarritos(); this.closeModal(); } },
                        error: (err) => console.log('Error creando detalle: ', err)
                    });
                    return;
                }
                // Actualizar detalle existente
                const updateData = { cantidad: det.cantidad };
                this.carritoService.updateDetalle_carrito(det.id_detalle, updateData).subscribe({
                    next: () => { pending--; if (pending === 0) { this.loadCarritos(); this.closeModal(); } },
                    error: (err) => console.log('Error actualizando detalle: ', err)
                });
            });
        } else {
            // === Por si no hay detalles, se crea un carrito nuevo ===
            const newCarrito: CreateCarritoRequest = {
                id_usuario: formValue.id_usuario,
                activo: formValue.activo
            };
            this.carritoService.createCarrito(newCarrito).subscribe({
                next: (created: any) => {
                    const carritoId = created.id_carrito;
                    const detallesToCreate = this.detalles.value.filter((d: any) => d.id_producto);
                    let pending = detallesToCreate.length;
                    if (pending === 0) { this.loadCarritos(); this.closeModal(); return; }

                    detallesToCreate.forEach((d: any) => {
                        const detallePayload = { id_carrito: carritoId, id_producto: d.id_producto, cantidad: d.cantidad };
                        this.carritoService.createDetalle_carrito(detallePayload).subscribe({
                            next: () => { pending--; if (pending === 0) { this.loadCarritos(); this.closeModal(); } },
                            error: (err) => console.log('Error creando detalle: ', err)
                        });
                    });
                },
                error: (err) => { console.log('Error creando carrito: ', err); alert('Hubo un error al crear el carrito.'); }
            });
        }
    }

    // === Pa agregar detalles ===
    agregarDetalle(): void {
        this.detalles.push(this.fb.group({
            id_producto: ['', Validators.required],
            cantidad: [1, [Validators.required, Validators.min(1)]],
            precio_producto: [0, [Validators.required, Validators.min(0)]],
            subtotal: [0]
        }));
    }

    eliminarDetalle(index: number): void {
        const detalle = this.detalles.at(index)?.value;
        if (!detalle?.id_detalle) { this.detalles.removeAt(index); return; }
        if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
            this.carritoService.deleteDetalle_carrito(detalle.id_detalle).subscribe({
                next: () => { this.detalles.removeAt(index); this.loadCarritos(); },
                error: (err) => console.log('Error eliminando detalle: ', err)
            });
        }
    }

    onSelectProducto(index: number): void {
        const detalleForm = this.detalles.at(index);
        const id_producto = detalleForm.get('id_producto')?.value;
        const producto = this.productos.find(p => p.id_producto === id_producto);
        if (producto) {
            detalleForm.patchValue({ precio_producto: producto.precio_producto });
            this.updateSubtotal(index);
        }
    }

    updateSubtotal(index: number): void {
        const detalleForm = this.detalles.at(index);
        const cantidad = detalleForm.get('cantidad')?.value || 0;
        const precio = detalleForm.get('precio_producto')?.value || 0;
        detalleForm.patchValue({ subtotal: cantidad * precio }, { emitEvent: false });
    }

    // === Pa desactivar el carrito ===
    desactivarCarrito(carrito: CarritoConDetalles): void {
        this.carritoService.disableCarrito(carrito.id_carrito).subscribe({
            next: () => this.loadCarritos(),
            error: (err) => { console.log('Error desactivando carrito: ', err); alert('No se pudo desactivar el carrito'); }
        });
    }

pagarCarrito(carrito: CarritoConDetalles): void {
    const confirmar = confirm(`¿Estás seguro de que quieres pagar el carrito ${carrito.id_carrito}?`);
    if (!confirmar) return;

    const metodo_pago = prompt('Ingrese su método de pago (Efectivo/Tarjeta):');
    if (!metodo_pago) return;

    this.facturaService.generateFactura({
        id_carrito: carrito.id_carrito,
        metodo_pago
    }).subscribe({
        next: () => { 
            this.loadCarritos(); 
            alert('Factura generada correctamente.'); 
        },
        error: (err) => { 
            console.log('Error generando factura: ', err); 
            alert('No se pudo generar la factura.'); 
        }
    });
} 
}
