import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Carrito, ItemCarrito } from './models/Carrito';
import { Producto } from './models/Producto';

@Injectable({
	providedIn: 'root'
})
export class CarritoService {
	private carritoVisible = new BehaviorSubject<boolean>(false);
	carritoVisible$ = this.carritoVisible.asObservable();

	private carritoActual = new BehaviorSubject<Carrito | null>(null);
	carritoActual$ = this.carritoActual.asObservable();

	constructor() {
		this.inicializarCarritoVacio();
	}

	mostrarCarrito() {
		this.carritoVisible.next(true);
	}

	ocultarCarrito() {
		this.carritoVisible.next(false);
	}

	toggleCarrito() {
		this.carritoVisible.next(!this.carritoVisible.value);
	}

	private inicializarCarritoVacio(): void {
		const carritoVacio: Carrito = {
			items: [],
			total: 0
		};
		this.carritoActual.next(carritoVacio);
	}

	private recalcularYActualizarCarrito(items: ItemCarrito[]): void {
		const nuevoTotal = items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
		const carritoActualizado: Carrito = {
			...this.carritoActual.value!,
			items: items,
			total: nuevoTotal
		};
		this.carritoActual.next(carritoActualizado);
	}

	agregarProducto(producto: Producto, cantidad: number = 1): void {
		const carrito = this.carritoActual.value;
		if (!carrito) return;

		const itemsActuales = [ ...carrito.items ];
		const itemExistenteIndex = itemsActuales.findIndex((item) => item.producto._id === producto._id);

		if (itemExistenteIndex > -1) {
			itemsActuales[itemExistenteIndex].cantidad += cantidad;
		} else {
			itemsActuales.push({ producto, cantidad });
		}
		this.recalcularYActualizarCarrito(itemsActuales);
	}

	actualizarCantidad(idProducto: string, nuevaCantidad: number): void {
		const carrito = this.carritoActual.value;
		if (!carrito) return;

		let itemsActuales = [ ...carrito.items ];
		const itemIndex = itemsActuales.findIndex((item) => item.producto._id === idProducto);

		if (itemIndex > -1) {
			if (nuevaCantidad > 0) {
				itemsActuales[itemIndex].cantidad = nuevaCantidad;
			} else {
				itemsActuales = itemsActuales.filter((item) => item.producto._id !== idProducto);
			}
			this.recalcularYActualizarCarrito(itemsActuales);
		}
	}

	eliminarProducto(idProducto: string): void {
		const carrito = this.carritoActual.value;
		if (!carrito) return;

		const itemsActuales = carrito.items.filter((item) => item.producto._id !== idProducto);
		this.recalcularYActualizarCarrito(itemsActuales);
	}

	limpiarCarrito(): void {
		this.inicializarCarritoVacio();
	}

}
