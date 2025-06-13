import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductosService } from '../productos.service';
import { Producto } from '../models/Producto';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-add-producto',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MaterialModule
	],
	templateUrl: './add-producto.component.html',
	styleUrls: [ './add-producto.component.css' ]
})
export class AddProductoComponent {
	addForm: FormGroup;
	categorias: string[] = [ 'movil', 'cargador', 'auriculares', 'bateriaPortatil' ];
	estadosProducto: string[] = [ 'Nuevo', 'Seminuevo - Como nuevo', 'Usado - Con detalles' ];

	constructor(
		public dialogRef: MatDialogRef<AddProductoComponent>,
		private fb: FormBuilder,
		private productosService: ProductosService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.addForm = this.fb.group({
			nombre: [ '', Validators.required ],
			marca: [ '', Validators.required ],
			descripcion: [ '', Validators.required ],
			precio: [ 0, [ Validators.required, Validators.min(0) ] ],
			stock: [ 1, [ Validators.required, Validators.min(1) ] ],
			categoria: [ '', Validators.required ],
			estadoProducto: [ 'Nuevo', Validators.required ],
			especificaciones: [ '' ],
			imagenes: [ '' ]
		});
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		if (this.addForm.invalid) {
			return;
		}

		const formValue = this.addForm.value;
		const nuevoProducto: Partial<Producto> = {
			...formValue,
			especificaciones: formValue.especificaciones.split(',').map((s: string) => s.trim()).filter(Boolean),
			imagenes: formValue.imagenes.split(',').map((s: string) => s.trim()).filter(Boolean)
		};

		this.productosService.crearProducto(nuevoProducto as Producto).subscribe({
			next: (res) => this.dialogRef.close(res.producto),
			error: (err) => console.error('Error al crear el producto', err)
		});
	}
}
