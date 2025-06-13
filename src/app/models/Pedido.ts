import { ArticuloPedido } from './ArticuloPedido';
import { Usuario } from './Usuario';

export interface Pedido {
	_id: string;
	usuario?: string | Usuario | null;
	nombreCompletoComprador: string;
	emailComprador: string;
	telefonoComprador: string;
	direccionEnvio: string;
	articulos: ArticuloPedido[];
	totalPedido: number;
	estadoPedido: 'Pendiente' | 'Aceptado' | 'Entregado';
	fechaEntrega?: string | Date;
	createdAt: string | Date;
	updatedAt: string | Date;
}
