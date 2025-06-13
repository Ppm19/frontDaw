import { Component, EventEmitter, Output, OnInit, Input, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginRegistroService } from '../login-registro.service';
import { Usuario } from '../models/Usuario';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegistroComponent } from '../registro/registro.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login-modal',
	standalone: true,
	imports: [
		CommonModule,
		MaterialModule,
		ReactiveFormsModule
	],
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
	isAuthenticated: boolean = false;
	currentUser: Usuario | null = null;

	loginForm!: FormGroup;
	loginError: string | null = null;

	constructor(
		private loginRegistroService: LoginRegistroService,
		public dialogRef: MatDialogRef<LoginModalComponent>,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private router: Router
	) {
		if (data) {
			this.isAuthenticated = data.isAuthenticated || false;
			this.currentUser = data.currentUser || null;
		}
		this.loginRegistroService.isAuthenticated$.subscribe(isAuth => this.isAuthenticated = isAuth);
		this.loginRegistroService.currentUser$.subscribe(user => this.currentUser = user);
	}

	ngOnInit(): void {
		if (!this.isAuthenticated) {
			this.loginForm = new FormGroup({
				email: new FormControl('', [Validators.required, Validators.email]),
				password: new FormControl('', [Validators.required, Validators.minLength(6)])
			});
		}
	}

	onSubmit() {
		if (this.loginForm.valid) {
			const { email, password } = this.loginForm.value;
			this.loginRegistroService.login({ email, password }).subscribe({
				next: (response) => {
					console.log('Login exitoso', response);
					
					const usuario = this.loginRegistroService.currentUserValue;
					if (usuario && usuario.tipo === 'admin') {
						this.router.navigate(['/menu-admin']);
					} else {
					}
					
					this.dialogRef.close(true);
				},
				error: (error) => {
					console.error('Error en login', error);
					this.loginError = error.message || 'Error al iniciar sesión';
				}
			});
		} else if (this.loginForm) {
			this.loginForm.markAllAsTouched();
		}
	}

	onCancelClick(): void {
		this.dialogRef.close({ reason: 'cancel' });
	}

	onLogoutClick(): void {
		this.loginRegistroService.logout();
		this.dialogRef.close({ reason: 'logout' });
	}

	onProfileClick(): void {
		this.dialogRef.close({ reason: 'profile' });
	}

	abrirModalRegistro(): void {
		this.dialogRef.close();
		this.dialog.open(RegistroComponent, {
			width: '500px',
			disableClose: true
		});
	}

	get email() { return this.loginForm?.get('email'); }
	get password() { return this.loginForm?.get('password'); }
}
