import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ProductosService } from '../productos.service';
import { Producto } from '../models/Producto';
import { AddProductoComponent } from '../add-producto/add-producto.component';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-admin-productos',
	standalone: true,
	imports: [ CommonModule, ReactiveFormsModule, MaterialModule ],
	templateUrl: './admin-productos.component.html',
	styleUrls: [ './admin-productos.component.css' ],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		])
	]
})
export class AdminProductosComponent implements OnInit {
	productos: Producto[] = [];
	displayedColumns: string[] = [ 'foto', 'nombre', 'acciones' ];
	expandedElement: Producto | null = null;
	editForm: FormGroup;

	categorias: string[] = [ 'movil', 'cargador', 'auriculares', 'bateriaPortatil' ];
	estadosProducto: string[] = [ 'Nuevo', 'Seminuevo - Como nuevo', 'Usado - Con detalles' ];

	constructor(
		private productosService: ProductosService,
		private fb: FormBuilder,
		public dialog: MatDialog,
		private router: Router
	) {
		this.editForm = this.fb.group({
			_id: [ '' ],
			nombre: [ '', Validators.required ],
			marca: [ '', Validators.required ],
			descripcion: [ '', Validators.required ],
			precio: [ 0, [ Validators.required, Validators.min(0) ] ],
			stock: [ 0, [ Validators.required, Validators.min(0) ] ],
			categoria: [ '', Validators.required ],
			estadoProducto: [ '', Validators.required ],
			especificaciones: [ '' ],
			imagenes: [ '' ] 
		});
	}

	ngOnInit(): void {
		this.cargarProductos();
	}

	cargarProductos(): void {
		this.productosService
			.getProductos()
			.subscribe(
				(data) => (this.productos = data),
				(error) => console.error('Error al cargar los productos:', error)
			);
	}

	toggleExpand(element: Producto): void {
		this.expandedElement = this.expandedElement === element ? null : element;
		if (this.expandedElement) {
			this.editForm.patchValue({
				...this.expandedElement,
				especificaciones: this.expandedElement.especificaciones.join(', '),
				imagenes: this.expandedElement.imagenes.join(', ')
			});
		}
	}

	guardarCambios(): void {
		if (this.editForm.invalid) return;

		const formValue = this.editForm.value;
		const productoActualizado: Partial<Producto> = {
			...formValue,
			especificaciones: formValue.especificaciones.split(',').map((s: string) => s.trim()),
			imagenes: formValue.imagenes.split(',').map((s: string) => s.trim())
		};

		this.productosService.actualizarProducto(formValue._id, productoActualizado).subscribe({
			next: () => {
				this.cargarProductos();
				this.expandedElement = null;
			},
			error: (err) => console.error('Error al guardar los cambios', err)
		});
	}

	eliminarProducto(id: string): void {
		if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
			this.productosService.eliminarProducto(id).subscribe({
				next: () => this.cargarProductos(),
				error: (err) => console.error('Error al eliminar el producto:', err)
			});
		}
	}

	volverAlMenu(): void {
		this.router.navigate([ '/menu-admin' ]);
	}

	abrirDialogoAnadir(): void {
		const dialogRef = this.dialog.open(AddProductoComponent, {
			width: '800px',
			disableClose: true
		});

		dialogRef.afterClosed().subscribe((result) => {
        if (result) {
				this.cargarProductos();
			}
		});
	}
}
