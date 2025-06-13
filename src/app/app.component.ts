import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CarritoComponent } from './carrito/carrito.component';
import { ModalCarritoComponent } from './modal-carrito/modal-carrito.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		CommonModule,
		CarritoComponent,
		ModalCarritoComponent
	],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'frontDaw';
	mostrarBotonCarrito: boolean = false;
	private routerSubscription!: Subscription;

	constructor(private router: Router) {}

	ngOnInit() {
		this.routerSubscription = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe(event => {
			if (event instanceof NavigationEnd) {
				const rutasSinBotonCarrito = ['/', '/perfil', '/contacto'];
				this.mostrarBotonCarrito = !rutasSinBotonCarrito.includes(event.urlAfterRedirects);
			}
		});
	}

	ngOnDestroy() {
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}
}
