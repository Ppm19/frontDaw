import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { Carrito, ItemCarrito } from '../models/Carrito';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-modal-carrito',
	standalone: true,
	imports: [ CommonModule, MaterialModule ],
	templateUrl: './modal-carrito.component.html',
	styleUrls: [ './modal-carrito.component.css' ]
})
export class ModalCarritoComponent implements OnInit, OnDestroy {
	isVisible: boolean = false;
	carrito: Carrito | null = null;
	private subscriptions: Subscription = new Subscription();

	constructor(public carritoService: CarritoService, private router: Router) {}

	ngOnInit(): void {
		this.subscriptions.add(
			this.carritoService.carritoVisible$.subscribe((visible) => {
				this.isVisible = visible;
			})
		);
		this.subscriptions.add(
			this.carritoService.carritoActual$.subscribe((carritoActual) => {
				this.carrito = carritoActual;
			})
		);
	}

	cerrarModal(): void {
		this.carritoService.ocultarCarrito();
	}

	eliminarItem(idProducto: string): void {
		if (idProducto) {
			this.carritoService.eliminarProducto(idProducto);
		}
	}

	actualizarCantidad(idProducto: string, nuevaCantidad: number): void {
		if (idProducto) {
			this.carritoService.actualizarCantidad(idProducto, nuevaCantidad);
		}
	}

	incrementarCantidad(item: ItemCarrito): void {
		this.actualizarCantidad(item.producto._id!, item.cantidad + 1);
	}

	decrementarCantidad(item: ItemCarrito): void {
		if (item.cantidad > 1) {
			this.actualizarCantidad(item.producto._id!, item.cantidad - 1);
		} else {
			this.eliminarItem(item.producto._id!);
		}
	}

	vaciarCarrito(): void {
		this.carritoService.limpiarCarrito();
	}

	procederAlPago(): void {
		this.cerrarModal();
		this.router.navigate([ '/realizar-pedido' ]);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
