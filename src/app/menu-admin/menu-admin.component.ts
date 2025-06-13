import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRegistroService } from '../login-registro.service';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-menu-admin',
	standalone: true,
	imports: [ CommonModule, MaterialModule ],
	templateUrl: './menu-admin.component.html',
	styleUrls: [ './menu-admin.component.css' ]
})
export class MenuAdminComponent {
	constructor(private router: Router, private loginRegistroService: LoginRegistroService) {}

	navigateTo(route: string): void {
		console.log('Navegando a:', route);
		this.router.navigate([ route ]);
	}

	logout(): void {
		this.loginRegistroService.logout();
		this.router.navigate([ '/principal' ]);
	}
}
