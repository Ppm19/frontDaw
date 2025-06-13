export interface ArticuloPedido {
	productoId: {
		_id: string;
		nombre: string;
		imagenes: string[];
	};
	nombreProducto: string;
	cantidad: number;
	precioAlComprar: number;
	imagenPrincipal?: string;
}
