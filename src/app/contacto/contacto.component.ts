import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRegistroService } from '../login-registro.service';
import { Subscription } from 'rxjs';
import { MenuInicioComponent } from '../menu-inicio/menu-inicio.component';
import { FooterComponent } from '../footer/footer.component';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-contacto',
	standalone: true,
	imports: [ CommonModule, ReactiveFormsModule, MenuInicioComponent, FooterComponent, MaterialModule ],
	templateUrl: './contacto.component.html',
	styleUrls: [ './contacto.component.css' ]
})
export class ContactoComponent implements OnInit, OnDestroy {
	contactForm: FormGroup;
	tiposConsulta = [ { value: 'duda', label: 'Duda' }, { value: 'incidencia', label: 'Incidencia' } ];
	private usuarioSubscription: Subscription | null = null;

	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private loginRegistroService: LoginRegistroService
	) {
		this.contactForm = this.fb.group({
			email: [ '', [ Validators.required, Validators.email ] ],
			tipo: [ null, Validators.required ],
			descripcion: [ '', [ Validators.required, Validators.minLength(10) ] ]
		});
	}

	ngOnInit(): void {
		this.usuarioSubscription = this.loginRegistroService.currentUser$.subscribe((usuario) => {
			if (usuario && usuario.email) {
				this.contactForm.patchValue({
					email: usuario.email
				});
			}
		});
	}

	ngOnDestroy(): void {
		if (this.usuarioSubscription) {
			this.usuarioSubscription.unsubscribe();
		}
	}

	onSubmit() {
		if (this.contactForm.valid) {
			console.log('Formulario enviado:', this.contactForm.value);
			this.contactForm.reset();
			this.contactForm.get('tipo')?.setErrors(null);
		} else {
			this.snackBar.open('Por favor, revisa los campos del formulario', 'Cerrar', {
				duration: 3000
			});
		}
	}
}
