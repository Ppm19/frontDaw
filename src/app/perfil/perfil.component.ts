import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginRegistroService } from '../login-registro.service';
import { Usuario } from '../models/Usuario';
import { PedidosService } from '../pedidos.service';
import { Pedido } from '../models/Pedido';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuInicioComponent } from '../menu-inicio/menu-inicio.component';
import { MatDialog } from '@angular/material/dialog';
import { DetallesProductoComponent } from '../detalles-producto/detalles-producto.component';
import { ProductosService } from '../productos.service';
import { CarritoService } from '../carrito.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from '../models/Producto';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-perfil',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MenuInicioComponent,
		MaterialModule
	],
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
	usuario: Usuario | null = null;
	private usuarioSubscription: Subscription | null = null;
	modoEdicion = false;
	perfilForm!: FormGroup;
	usuarioEditable!: Partial<Usuario>;
	errorActualizacion: string | null = null;
	errorFormulario: string | null = null;

	pedidosDelUsuario: Pedido[] = [];
	pedidosPendientes: Pedido[] = [];
	pedidosAceptados: Pedido[] = [];

	mostrandoFormularioNuevaDireccion: boolean = false;
	nuevaDireccionInput: string = '';

	productosListaDeseos: Producto[] = [];
	isLoadingListaDeseos: boolean = false;

	@ViewChild('nuevaContrasenaInput') nuevaContrasenaInput!: ElementRef<HTMLInputElement>;
	@ViewChild('confirmarContrasenaInput') confirmarContrasenaInput!: ElementRef<HTMLInputElement>;

	constructor(
		private loginRegistroService: LoginRegistroService,
		private fb: FormBuilder,
		private router: Router,
		private pedidosService: PedidosService,
		private productosService: ProductosService,
		private carritoService: CarritoService,
		public dialog: MatDialog
	) { }

	ngOnInit(): void {
		this.usuarioSubscription = this.loginRegistroService.currentUser$.subscribe((usuario: Usuario | null) => {
			if (usuario) {
				const listaDeseosAnterior = this.usuario?.listaDeseos ? JSON.stringify(this.usuario.listaDeseos) : null;
				this.usuario = { ...usuario };
				this.inicializarFormulario();
				this.cargarPedidosUsuario();

				if (JSON.stringify(this.usuario.listaDeseos) !== listaDeseosAnterior || (this.productosListaDeseos.length === 0 && (this.usuario.listaDeseos?.length || 0) > 0)) {
					this.cargarProductosListaDeseos();
				} else if (!this.usuario.listaDeseos || this.usuario.listaDeseos.length === 0) {
					this.productosListaDeseos = [];
					this.isLoadingListaDeseos = false;
				}
			} else {
				this.router.navigate(['/productos']);
				console.warn('Usuario no logueado al acceder a perfil, redirigiendo a /productos.');
			}
		});
	}

	ngOnDestroy(): void {
		if (this.usuarioSubscription) {
			this.usuarioSubscription.unsubscribe();
		}
	}

	inicializarFormulario(): void {
		if (this.usuario) {
			this.usuarioEditable = { ...this.usuario };
			this.perfilForm = this.fb.group({
				nombre: [this.usuarioEditable.nombre, Validators.required],
				primerApellido: [this.usuarioEditable.primerApellido, Validators.required],
				segundoApellido: [this.usuarioEditable.segundoApellido],
				telefono: [this.usuarioEditable.telefono, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
				email: [this.usuarioEditable.email, [Validators.required, Validators.email]],
				password: [''],
				confirmarPassword: ['']
			}, { validator: this.matchPasswords('password', 'confirmarPassword') });
		}
	}

	matchPasswords(controlName: string, matchingControlName: string) {
		return (formGroup: FormGroup) => {
			const control = formGroup.controls[controlName];
			const matchingControl = formGroup.controls[matchingControlName];
			if (matchingControl.errors && !matchingControl.errors['passwordsMismatch']) {
				return;
			}
			if (control.value !== matchingControl.value) {
				matchingControl.setErrors({ passwordsMismatch: true });
			} else {
				matchingControl.setErrors(null);
			}
		};
	}

	cargarPedidosUsuario(): void {
		if (this.usuario && this.usuario._id) {
			this.pedidosService.getPedidosPorUsuario(this.usuario._id).subscribe({
				next: (pedidos) => {
					this.pedidosDelUsuario = pedidos;
					this.pedidosPendientes = pedidos.filter(p => p.estadoPedido === 'Pendiente');
					this.pedidosAceptados = pedidos.filter(p => p.estadoPedido === 'Aceptado');
				},
				error: (error) => {
					console.error('Error al cargar los pedidos del usuario:', error);
				}
			});
		} else {
			console.warn('No se pudo cargar pedidos: Usuario o ID de usuario no disponible.');
		}
	}

	editarPerfil(): void {
		this.modoEdicion = true;
		this.errorActualizacion = null;
		this.errorFormulario = null;
		if (this.usuario) {
			this.usuarioEditable = { ...this.usuario };
			this.perfilForm.reset({
				nombre: this.usuario.nombre,
				primerApellido: this.usuario.primerApellido,
				segundoApellido: this.usuario.segundoApellido || '',
				telefono: this.usuario.telefono,
				email: this.usuario.email,
				password: '',
				confirmarPassword: ''
			});
		}
	}

	cancelarEdicionPerfil(): void {
		this.modoEdicion = false;
		this.errorActualizacion = null;
		this.errorFormulario = null;
		if (this.usuario) {
			this.inicializarFormulario();
		}
	}

	guardarCambiosPerfil(): void {
		this.errorActualizacion = null;
		this.errorFormulario = null;

		if (this.perfilForm.invalid) {
			this.errorFormulario = "Por favor, corrige los errores en el formulario.";
			Object.values(this.perfilForm.controls).forEach(control => {
				control.markAsTouched();
			});
			return;
		}

		if (!this.usuario || !this.usuario._id) {
			this.errorActualizacion = 'Error: No se pudo identificar al usuario.';
			return;
		}

		const formValues = this.perfilForm.value;
		const datosParaActualizar: Partial<Usuario> = {
			nombre: formValues.nombre,
			primerApellido: formValues.primerApellido,
			segundoApellido: formValues.segundoApellido,
			telefono: formValues.telefono,
			email: formValues.email,
		};

		if (formValues.password && formValues.password.trim() !== '') {
			datosParaActualizar.password = formValues.password;
		}

		this.loginRegistroService.actualizarUsuario(this.usuario._id, datosParaActualizar).subscribe({
			next: (usuarioActualizadoRespuesta) => {
				this.modoEdicion = false;
			},
			error: (error) => {
				console.error('Error al actualizar el perfil:', error);
				this.errorActualizacion = error.message || 'Ocurrió un error al actualizar el perfil.';
			}
		});
	}

	anadirDireccion(): void {
		this.mostrandoFormularioNuevaDireccion = true;
		this.nuevaDireccionInput = '';
	}

	guardarNuevaDireccion(): void {
		if (!this.nuevaDireccionInput.trim()) {
			return;
		}
		if (this.usuario && this.usuario._id) {
			const direccionAAgregar = this.nuevaDireccionInput.trim();
			if (this.usuario.direcciones && this.usuario.direcciones.includes(direccionAAgregar)) {
				return;
			}
			const nuevasDirecciones = [...(this.usuario.direcciones || []), direccionAAgregar];

			this.loginRegistroService.actualizarUsuario(this.usuario._id, { direcciones: nuevasDirecciones }).subscribe({
				next: (usuarioActualizado) => {
					this.mostrandoFormularioNuevaDireccion = false;
					this.nuevaDireccionInput = '';
				},
				error: (err) => {
					console.error('Error al guardar la nueva dirección:', err);
				}
			});
		} else {
			console.warn('No se pudo guardar la dirección: Usuario no identificado.');
		}
	}

	eliminarDireccion(direccionAEliminar: string): void {
		if (this.usuario && this.usuario._id && this.usuario.direcciones) {
			const nuevasDirecciones = this.usuario.direcciones.filter(d => d !== direccionAEliminar);
			this.loginRegistroService.actualizarUsuario(this.usuario._id, { direcciones: nuevasDirecciones }).subscribe({
				next: (usuarioActualizado) => {
					console.log('Dirección eliminada con éxito.');
				},
				error: (err) => {
					console.error('Error al eliminar la dirección:', err);
				}
			});
		} else {
			console.warn('No se pudo eliminar la dirección: Usuario o direcciones no encontradas.');
		}
	}

	cancelarNuevaDireccion(): void {
		this.mostrandoFormularioNuevaDireccion = false;
		this.nuevaDireccionInput = '';
	}

	cargarProductosListaDeseos(): void {
		if (this.usuario && this.usuario.listaDeseos && this.usuario.listaDeseos.length > 0) {
			this.isLoadingListaDeseos = true;
			this.productosListaDeseos = [];

			const observables = this.usuario.listaDeseos.map(id =>
				this.productosService.getProductoPorId(id).pipe(
					catchError(err => {
						console.error(`Error al cargar producto ${id} de lista de deseos:`, err);
						return of(null);
					})
				)
			);

			forkJoin(observables).subscribe({
				next: (productos) => {
					this.productosListaDeseos = productos.filter(p => p !== null) as Producto[];
					this.isLoadingListaDeseos = false;
				},
				error: () => {
					this.isLoadingListaDeseos = false;
				}
			});
		} else {
			this.productosListaDeseos = [];
			this.isLoadingListaDeseos = false;
		}
	}

	verDetallesProductoEnLista(producto: Producto): void {
		this.dialog.open(DetallesProductoComponent, {
			data: { producto: producto },
			width: '800px',
			maxWidth: '90vw',
			autoFocus: false
		});
	}

	eliminarDeListaDeseos(productoId: string, event?: MouseEvent): void {
		event?.stopPropagation();
		if (this.usuario && this.usuario._id && this.usuario.listaDeseos) {
			const nuevaLista = this.usuario.listaDeseos.filter(id => id !== productoId);
			this.loginRegistroService.actualizarUsuario(this.usuario._id, { listaDeseos: nuevaLista })
				.subscribe({
					next: () => {
						console.log('Producto eliminado de la lista de deseos.');
					},
					error: (err) => {
						console.error('Error al eliminar de lista de deseos:', err);
					}
				});
		} else {
			console.error("Usuario no autenticado o lista de deseos no encontrada.");
		}
	}

	anadirAlCarritoYQuitarDeDeseos(producto: Producto, event?: MouseEvent): void {
		event?.stopPropagation();
		this.carritoService.agregarProducto(producto);
		if (producto._id) {
			this.eliminarDeListaDeseos(producto._id, event);
		} else {
			console.error("El producto no tiene ID, no se puede eliminar de la lista de deseos.");
		}
	}
}
