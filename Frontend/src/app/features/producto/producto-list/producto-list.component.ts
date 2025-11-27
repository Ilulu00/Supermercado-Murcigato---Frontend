import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ProductoService } from '../../../core/services/producto.service';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { Categoria } from '../../../shared/models/categoria.model';
import { Producto, ProductoFilters } from '../../../shared/models/producto.model';
import { Proveedor } from '../../../shared/models/proveedor.models';
@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.scss'
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  proveedores: Proveedor[] = []
  categorias: Categoria[] = []

  filters: ProductoFilters = {};

  // Modal properties
  showModal = false;
  editingProducto: Producto | null = null;
  productoForm = {
    nombre_producto: '',
    precio_producto: 0,
    stock: 0,
    id_categoria: '',
    id_proveedor: '',
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString() ?? ' - '
  };

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.loadProductos();
    this.getProveedores();
    this.getCategorias();
  }

  getCategorias(): void {
    const pagination = { page: 0, limit: 9999 };
    this.categoriaService.getCategorias(pagination, {}).subscribe(
      res => {
        this.categorias = res.data;
        console.log('Categorias cargadas: ', this.categorias);
      },
      err => {
        console.log('Error al cargar las categorias: ', err);
      }
    );
  }

  getProveedores(): void {
    const pagination = { page: 0, limit: 9999 };
    this.proveedorService.getProveedores(pagination, {}).subscribe(
      resp => {
        this.proveedores = resp.data;
        console.log('Proveedores cargados: ', this.proveedores)
      }
    )
  }

  loadProductos(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.productoService.getProductos(pagination, this.filters).subscribe({
      next: (resp) => {
        this.productos = resp.data;
        this.totalPages = resp.totalPages;
        this.currentPage = resp.currentPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        // Si el backend no está disponible, usar datos mock
        if (error.status === 0 || error.status === undefined) {
          console.log('Backend no disponible, usando datos mock para productos');
          this.productos = [{
            id_producto: '1',
            nombre_producto: 'Agility Gold cuidado especial para la piel perros',
            precio_producto: 70000,
            stock: 15,
            id_categoria: '1',
            id_proveedor: '1',
            categoria: {
              nombre_categoria: 'Mascotas'
            },
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString()
          }];
          this.totalPages = 1;
        }
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProductos();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadProductos();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProductos();
    }
  }

  openCreateModal(): void {
    this.editingProducto = null;
    this.productoForm = {
      nombre_producto: '',
      precio_producto: 0,
      stock: 0,
      id_categoria: '',
      id_proveedor: '',
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString() ?? ' - '
    };
    this.showModal = true;
  }

  editProducto(producto: Producto): void {
    this.editingProducto = producto;
    this.productoForm = {
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      stock: producto.stock,
      id_categoria: producto.id_categoria,
      id_proveedor: producto.id_proveedor,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString() ?? ' - '
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProducto = null;
    this.productoForm = {
      nombre_producto: '',
      precio_producto: 0,
      stock: 0,
      id_categoria: '',
      id_proveedor: '',
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString() ?? ' - '
    };
  }

  saveProducto(): void {
    if (!this.productoForm.nombre_producto.trim() || this.productoForm.precio_producto <= 0 || this.productoForm.stock < 0 || !this.productoForm.id_categoria || !this.productoForm.id_proveedor) {
      alert('Nombre, precio, stock, categoría y proveedor son requeridos');
      return;
    }

    if (this.editingProducto) {
      // Actualizar producto existente
      const updateData = {
        nombre_producto: this.productoForm.nombre_producto,
        precio_producto: this.productoForm.precio_producto,
        stock: this.productoForm.stock,
        id_categoria: this.productoForm.id_categoria,
        id_proveedor: this.productoForm.id_proveedor,
        fecha_creacion: this.productoForm.fecha_creacion,
        fecha_actualizacion: this.productoForm.fecha_actualizacion
      };

      this.productoService.updateProducto(this.editingProducto.id_producto, updateData).subscribe({
        next: () => {
          this.loadProductos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
          alert('Error al actualizar el producto');
        }
      });
    } else {
      // Crear nuevo producto
      const newProducto = {
        nombre_producto: this.productoForm.nombre_producto,
        precio_producto: this.productoForm.precio_producto,
        stock: this.productoForm.stock,
        id_categoria: this.productoForm.id_categoria,
        id_proveedor: this.productoForm.id_proveedor,
        fecha_creacion: this.productoForm.fecha_creacion
      };

      this.productoService.createProducto(newProducto).subscribe({
        next: () => {
          this.loadProductos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear producto:', error);
          alert('Error al crear el producto');
        }
      });
    }
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }
}
