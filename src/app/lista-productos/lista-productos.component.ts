import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { Producto } from '../models/Producto';
import { ProductosService } from '../productos.service';
import { MenuProductosComponent } from '../menu-productos/menu-productos.component';
import { CarritoService } from '../carrito.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetallesProductoComponent } from '../detalles-producto/detalles-producto.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginRegistroService } from '../login-registro.service';
import { Usuario } from '../models/Usuario';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-lista-productos',
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		MaterialModule,
		MenuProductosComponent,
		RouterModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatSnackBarModule,
		MatDialogModule,
		FormsModule,
	],
	templateUrl: './lista-productos.component.html',
	styleUrls: [ './lista-productos.component.css' ]
})
export class ListaProductosComponent implements OnInit {
	productos: Producto[] = [];
	productosFiltrados: Producto[] = [];
	terminoBusqueda: string = '';
	isLoading = true;
	errorMensaje: string | null = null;
	usuarioActual: Usuario | null = null;
	private usuarioSubscription: Subscription | null = null;

	constructor(
		private productosService: ProductosService,
		private carritoService: CarritoService,
		private loginRegistroService: LoginRegistroService,
		private snackBar: MatSnackBar,
		public dialog: MatDialog,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	ngOnInit(): void {
		this.cargarProductos();
		this.usuarioSubscription = this.loginRegistroService.currentUser$.subscribe(usuario => {
			this.usuarioActual = usuario;
		});
	}

	ngOnDestroy(): void {
		if (this.usuarioSubscription) {
			this.usuarioSubscription.unsubscribe();
		}
	}

	cargarProductos(): void {
		this.isLoading = true;
		this.errorMensaje = null;
		this.productosService.getProductos().subscribe({
			next: (data) => {
				this.productos = data;
				this.productosFiltrados = data;
				this.isLoading = false;
			},
			error: (err) => {
				if (isPlatformBrowser(this.platformId)) {
					console.error('Error al cargar productos:', err);
				} else {
					console.error('Error al cargar productos (SSR):', err.message);
				}
				this.errorMensaje = 'No se pudieron cargar los productos. Inténtalo de nuevo más tarde.';
				this.isLoading = false;
			}
		});
	}

	aplicarFiltro(): void {
		if (!this.terminoBusqueda) {
			this.productosFiltrados = [...this.productos];
		} else {
			this.productosFiltrados = this.productos.filter((producto) =>
				producto.nombre
					.toLowerCase()
					.includes(this.terminoBusqueda.toLowerCase())
			);
		}
	}

	anadirAlCarrito(producto: Producto): void {
		this.carritoService.agregarProducto(producto);
		this.snackBar.open(`${producto.nombre} añadido al carrito`, 'Cerrar', { duration: 3000 });
	}

	mostrarDetalles(producto: Producto): void {
		this.dialog.open(DetallesProductoComponent, {
			data: { producto: producto },
			width: '800px',
			maxWidth: '90vw',
			autoFocus: false,
			panelClass: 'detalle-producto-dialog'
		});
	}

	toggleFavorito(producto: Producto): void {
		if (!this.usuarioActual || !this.usuarioActual._id || !producto._id) {
			this.snackBar.open('Necesitas iniciar sesión para gestionar favoritos', 'Cerrar', { duration: 3000 });
			return;
		}
	}

	estaEnFavoritos(productoId: string): boolean {
		return this.usuarioActual?.listaDeseos?.includes(productoId) || false;
	}
}
