import { Producto } from './Producto';

export interface ItemCarrito {
	producto: Producto;
	cantidad: number;
}

export interface Carrito {
	_id?: string;
	items: ItemCarrito[];
	total: number;

}
