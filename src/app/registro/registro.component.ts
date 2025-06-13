import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRegistroService } from '../login-registro.service';
import { Usuario } from '../models/Usuario';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  formPaso1!: FormGroup;
  formPaso2!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginRegistroService: LoginRegistroService,
    public dialogRef: MatDialogRef<RegistroComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formPaso1 = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    }, { validator: this.matchPasswords('password', 'confirmarPassword') });

    this.formPaso2 = this.fb.group({
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  matchPasswords(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['passwordsMismatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordsMismatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  registrarse(): void {
    if (this.formPaso1.invalid || this.formPaso2.invalid) {
      this.snackBar.open('Por favor, completa todos los campos requeridos correctamente.', 'Cerrar', { duration: 3000 });
      this.formPaso1.markAllAsTouched();
      this.formPaso2.markAllAsTouched();
      return;
    }

    const datosPaso1 = this.formPaso1.value;
    const datosPaso2 = this.formPaso2.value;

    const nuevoUsuario: Usuario = {
      nombre: datosPaso2.nombre,
      primerApellido: datosPaso2.primerApellido,
      segundoApellido: datosPaso2.segundoApellido || undefined,
      telefono: datosPaso2.telefono,
      email: datosPaso1.email,
      password: datosPaso1.password,
      tipo: 'usuario',
      direcciones: [],
      listaDeseos: []
    };

    this.loginRegistroService.registrarUsuario(nuevoUsuario).subscribe({
      next: (respuesta) => {
        this.snackBar.open('¡Registro exitoso! Ahora puedes iniciar sesión.', 'Cerrar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.snackBar.open(err.message || 'Error en el registro. Por favor, inténtalo de nuevo.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cerrarDialog(): void {
    this.dialogRef.close();
  }
}
