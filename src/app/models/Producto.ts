export interface Producto {
	_id?: string;
	nombre: string;
	marca: string;
	descripcion: string;
	especificaciones: string[];
	precio: number;
	stock: number;
	imagenes: string[];
	categoria: 'movil' | 'cargador' | 'auriculares' | 'bateriaPortatil';
	estadoProducto: 'Nuevo' | 'Seminuevo - Como nuevo' | 'Usado - Con detalles';
	createdAt?: Date;
	updatedAt?: Date;
}
