export interface Usuario {
	_id?: string;
	nombre: string;
	primerApellido: string;
	segundoApellido?: string;
	telefono: string;
	email: string;
	password?: string;
	tipo: 'usuario' | 'admin';
	direcciones?: string[];
	listaDeseos?: string[];
	createdAt?: string | Date;
	updatedAt?: string | Date;
}
