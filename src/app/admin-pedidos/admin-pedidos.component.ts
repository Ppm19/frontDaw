import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../pedidos.service';
import { Pedido } from '../models/Pedido';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';

@Component({
	selector: 'app-admin-pedidos',
	standalone: true,
	imports: [ CommonModule, MaterialModule ],
	templateUrl: './admin-pedidos.component.html',
	styleUrls: [ './admin-pedidos.component.css' ]
})
export class AdminPedidosComponent implements OnInit {
	pedidosPendientes: Pedido[] = [];
	pedidosAceptados: Pedido[] = [];
	isLoading = true;

	constructor(private pedidosService: PedidosService, private router: Router) {}

	ngOnInit(): void {
		this.cargarPedidos();
	}

	cargarPedidos(): void {
		this.isLoading = true;
		this.pedidosService.getPedidos('Pendiente').subscribe({
			next: (pedidos) => {
				this.pedidosPendientes = pedidos;
				this.isLoading = false;
			},
			error: (err) => {
				console.error('Error al cargar los pedidos pendientes', err);
				this.isLoading = false;
			}
		});

		this.pedidosService.getPedidos('Aceptado').subscribe({
			next: (pedidos) => {
				this.pedidosAceptados = pedidos;
			},
			error: (err) => {
				console.error('Error al cargar los pedidos aceptados', err);
			}
		});
	}

	aceptarPedido(id: string): void {
		const actualizaciones: Partial<Pedido> = {
			estadoPedido: 'Aceptado',
			fechaEntrega: new Date()
		};

		this.pedidosService.actualizarPedido(id, actualizaciones).subscribe({
			next: () => {
				this.cargarPedidos();
			},
			error: (err) => console.error('Error al aceptar el pedido', err)
		});
	}

	rechazarPedido(id: string): void {
		if (confirm('¿Estás seguro de que quieres rechazar y eliminar este pedido?')) {
			this.pedidosService.eliminarPedido(id).subscribe({
				next: () => {
					this.cargarPedidos();
				},
				error: (err) => console.error('Error al rechazar el pedido', err)
			});
		}
	}

	eliminarPedidoAceptado(id: string): void {
		if (confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción es permanente.')) {
			this.pedidosService.eliminarPedido(id).subscribe({
				next: () => {
					this.cargarPedidos();
				},
				error: (err) => console.error('Error al eliminar el pedido', err)
			});
		}
	}

	volverAlMenu(): void {
		this.router.navigate([ '/menu-admin' ]);
	}
}
