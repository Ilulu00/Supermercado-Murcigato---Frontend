import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CreateUsuarioRequest, UpdateUsuarioRequest, Usuario, UsuarioFilters } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: UsuarioFilters = {};

  // Modal properties
  showModal = false;
  editingUsuario: Usuario | null = null;
  usuarioForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    
    this.usuarioForm = this.fb.group({
      primer_nombre: ['', [Validators.required, Validators.minLength(2)]],
      segundo_nombre: [''],
      primer_apellido: ['', [Validators.required, Validators.minLength(2)]],
      segundo_apellido: [''],
      correo: [''],
      telefono: [''],
      activo: [true],
      es_admin: [false],
      fecha_registro: [new Date().toISOString()]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true; 
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.usuarioService.getUsuarios(pagination, this.filters).subscribe({
      next: (resp) => {
        this.usuarios = resp.data;
        this.totalPages = resp.totalPages;
        this.currentPage = resp.currentPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        // Si el backend no está disponible, usar datos mock
        if (error.status === 0 || error.status === undefined) {
          console.log('Backend no disponible, usando datos mock para usuarios');
          this.usuarios = [{
            id_usuario: '1',
            primer_nombre: 'Administrador',
            segundo_nombre: '',
            primer_apellido: 'Mock',
            segundo_apellido: '',
            correo: 'admin@mock.com',
            telefono: '',
            activo: true, 
            es_admin: true,
            fecha_registro: new Date().toISOString(),
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
    this.loadUsuarios();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadUsuarios();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsuarios();
    }
  }

  openCreateModal(): void {
    this.editingUsuario = null;
    this.usuarioForm.reset({
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      correo: '',
      telefono: '',
      es_admin: false,
      activo: true,
      fecha_registro: new Date().toISOString(),
    });
    this.showModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm.patchValue({
      primer_nombre: usuario.primer_nombre,
      segundo_nombre: usuario.segundo_nombre,
      primer_apellido: usuario.primer_apellido,
      segundo_apellido: usuario.segundo_apellido,
      correo: usuario.correo,
      telefono: usuario.telefono || '',
      activo: usuario.activo,
      es_admin: usuario.es_admin
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
    this.usuarioForm.reset();
  }

  saveUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formValue = this.usuarioForm.value;

    if (this.editingUsuario) {
      // Actualizar usuario existente
      const updateData: UpdateUsuarioRequest = {
        primer_nombre: formValue.primer_nombre,
        segundo_nombre: formValue.segundo_nombre,
        primer_apellido: formValue.primer_apellido,
        segundo_apellido: formValue.segundo_apellido,
        correo: formValue.correo,
        telefono: formValue.telefono,
        es_admin: formValue.es_admin
      };

      this.usuarioService.updateUsuario(this.editingUsuario.id_usuario, updateData).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          alert('Error al actualizar el usuario');
        }
      });
    } else {
      // Crear nuevo usuario
      const newUsuario: CreateUsuarioRequest = {
        primer_nombre: formValue.primer_nombre,
        segundo_nombre: formValue.segundo_nombre,
        primer_apellido: formValue.primer_apellido,
        segundo_apellido: formValue.segundo_apellido,
        correo: formValue.correo,
        telefono: formValue.telefono,
        es_admin: formValue.es_admin,
        activo: formValue.activo,
        fecha_registro: formValue.fecha_registro
      };

      this.usuarioService.createUsuario(newUsuario).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          alert('Error al crear el usuario');
        }
      });
    }
  }

  desactivarUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de desactivar el usuario "${usuario.correo}"?`)) {
      this.usuarioService.desactivarUsuario(usuario.id_usuario).subscribe({
        next: () => {
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Error al desactivar usuario:', error);
          alert('Error al desactivar el usuario');
        }
      });
    }
  }
}