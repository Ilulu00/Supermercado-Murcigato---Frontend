import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria, CategoriaFilters } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.scss'
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: CategoriaFilters = {};

  // Modal properties
  showModal = false;
  editingCategoria: Categoria | null = null;
  categoriaForm = {
    nombre_categoria: '',
    descripcion: '',
    fecha_creacion:  new Date().toISOString(),
    fecha_edicion: new Date().toISOString() ?? ' - '
  };

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.categoriaService.getCategorias(pagination, this.filters).subscribe({
      next: (resp) => {
        this.categorias = resp.data;
        this.totalPages = resp.totalPages;
        this.currentPage = resp.currentPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        // Si el backend no está disponible, usar datos mock
        if (error.status === 0 || error.status === undefined) {
          console.log('Backend no disponible, usando datos mock para categorías');
          this.categorias = [{
            id_categoria: '1',
            nombre_categoria: 'Mascotas',
            descripcion: 'Productos hechos para las mascotas del hogar, sanos para ellos.',
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
    this.loadCategorias();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadCategorias();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCategorias();
    }
  }

  openCreateModal(): void {
    this.editingCategoria = null;
    this.categoriaForm = {
      nombre_categoria: '',
      descripcion: '',
      fecha_creacion:  new Date().toISOString(),
      fecha_edicion: new Date().toISOString() ?? ' - '
    };
    this.showModal = true;
  }

  editCategoria(categoria: Categoria): void {
    this.editingCategoria = categoria;
    this.categoriaForm = {
      nombre_categoria: categoria.nombre_categoria,
      descripcion: categoria.descripcion || ' - ',
      fecha_creacion: categoria.fecha_creacion,
      fecha_edicion: categoria.fecha_edicion || ' - '
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCategoria = null;
    this.categoriaForm = {
      nombre_categoria: '',
      descripcion: '',
      fecha_creacion: new Date().toISOString(),
      fecha_edicion: new Date().toISOString(),
    };
  }

  saveCategoria(): void {
    if (!this.categoriaForm.nombre_categoria.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (this.editingCategoria) {
      // Actualizar categoría existente
      const updateData = {
        nombre: this.categoriaForm.nombre_categoria,
        descripcion: this.categoriaForm.descripcion,
        fecha_edicion: this.categoriaForm.fecha_edicion
      };

      this.categoriaService.updateCategoria(this.editingCategoria.id_categoria, updateData).subscribe({
        next: () => {
          this.loadCategorias();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          alert('Error al actualizar la categoría');
        }
      });
    } else {
      // Crear nueva categoría
      const newCategoria = {
        nombre_categoria: this.categoriaForm.nombre_categoria,
        descripcion: this.categoriaForm.descripcion,
        fecha_creacion: new Date().toISOString(),
      };

      this.categoriaService.createCategoria(newCategoria).subscribe({
        next: () => {
          this.loadCategorias();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          alert('Error al crear la categoría');
        }
      });
    }
  }
}
