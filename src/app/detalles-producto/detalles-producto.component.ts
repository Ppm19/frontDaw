import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../models/Producto';
import { CarritoService } from '../carrito.service';
import { LoginRegistroService } from '../login-registro.service';
import { Usuario } from '../models/Usuario';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-detalles-producto',
	standalone: true,
	imports: [ CommonModule, MaterialModule ],
	templateUrl: './detalles-producto.component.html',
	styleUrls: [ './detalles-producto.component.css' ]
})
export class DetallesProductoComponent implements OnInit, OnDestroy {
	producto: Producto;
	usuarioActual: Usuario | null = null;
	private usuarioSubscription: Subscription | null = null;
	estaEnListaDeseos: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<DetallesProductoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { producto: Producto },
		private carritoService: CarritoService,
		private loginRegistroService: LoginRegistroService,
		private snackBar: MatSnackBar
	) {
		this.producto = data.producto;
	}

	ngOnInit(): void {
		this.usuarioSubscription = this.loginRegistroService.currentUser$.subscribe((usuario) => {
			this.usuarioActual = usuario;
			this.verificarListaDeseos();
		});
	}

	ngOnDestroy(): void {
		if (this.usuarioSubscription) {
			this.usuarioSubscription.unsubscribe();
		}
	}

	cerrarModal(): void {
		this.dialogRef.close();
	}

	anadirAlCarrito(): void {
		this.carritoService.agregarProducto(this.producto);
		this.snackBar.open(`${this.producto.nombre} añadido al carrito`, 'Cerrar', { duration: 3000 });
	}

	verificarListaDeseos(): void {
		if (this.usuarioActual && this.usuarioActual.listaDeseos && this.producto._id) {
			this.estaEnListaDeseos = this.usuarioActual.listaDeseos.includes(this.producto._id);
		} else {
			this.estaEnListaDeseos = false;
		}
	}

	toggleListaDeseos(): void {
		if (!this.usuarioActual || !this.usuarioActual._id || !this.producto._id) {
			return;
		}

		const idProducto = this.producto._id;
		const estabaEnListaDeseosAntes = this.estaEnListaDeseos;
		let nuevaListaDeseos = [ ...(this.usuarioActual.listaDeseos || []) ];

		if (estabaEnListaDeseosAntes) {
			nuevaListaDeseos = nuevaListaDeseos.filter((id) => id !== idProducto);
		} else {
			if (!nuevaListaDeseos.includes(idProducto)) {
				nuevaListaDeseos.push(idProducto);
			}
		}

		this.loginRegistroService
			.actualizarUsuario(this.usuarioActual._id, { listaDeseos: nuevaListaDeseos })
			.subscribe({
				next: (usuarioActualizado) => {
					this.verificarListaDeseos();
				},
				error: (err) => {
					console.error('Error al actualizar lista de deseos:', err);
				}
			});
	}

	getImagenPrincipal(): string {
		if (this.producto.imagenes && this.producto.imagenes.length > 0) {
			return this.producto.imagenes[0];
		}
		return 'assets/placeholder-image.png';
	}

	objectKeys(obj: any): string[] {
		return Object.keys(obj || {});
	}
}
