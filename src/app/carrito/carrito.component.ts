import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-carrito',
	standalone: true,
	imports: [ CommonModule, MaterialModule ],
	templateUrl: './carrito.component.html',
	styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit, OnDestroy {
	mostrarEsteComponente: boolean = true;
	private routerSubscription!: Subscription;

	constructor(
		private carritoService: CarritoService,
		private router: Router
	) {}

	ngOnInit(): void {
		const rutasOcultas = ['/realizar-pedido', '/principal', '/perfil', '/contacto', "/menu-admin", "/admin-productos", "/admin-pedidos"];

		this.routerSubscription = this.router.events.pipe(
			startWith(new NavigationEnd(0, this.router.url, this.router.url)),
			filter((event): event is NavigationEnd => event instanceof NavigationEnd)
		).subscribe((event: NavigationEnd) => {
			const urlActual = event.urlAfterRedirects;
			this.mostrarEsteComponente = !rutasOcultas.some(ruta => urlActual.startsWith(ruta));
		});
	}

	toggleCarritoModal() {
		this.carritoService.toggleCarrito();
	}

	ngOnDestroy(): void {
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}
}
