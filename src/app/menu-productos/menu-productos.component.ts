import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoginRegistroService } from '../login-registro.service';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-menu-productos',
	standalone: true,
	imports: [ RouterLink, CommonModule, MaterialModule ],
	templateUrl: './menu-productos.component.html',
	styleUrls: [ './menu-productos.component.css' ]
})
export class MenuProductosComponent implements OnInit, OnDestroy {
	isExpanded = false;
	isAuthenticated: boolean = false;
	private authSubscription?: Subscription;

	constructor(private loginRegistroService: LoginRegistroService) {}

	ngOnInit(): void {
		this.authSubscription = this.loginRegistroService.isAuthenticated$.subscribe(
			(isAuth) => (this.isAuthenticated = isAuth)
		);
	}

	toggleMenu() {
		this.isExpanded = !this.isExpanded;
	}

	ngOnDestroy(): void {
		if (this.authSubscription) {
			this.authSubscription.unsubscribe();
		}
	}
}
