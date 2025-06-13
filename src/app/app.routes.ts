import { Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { ListaMovilesComponent } from './lista-moviles/lista-moviles.component';
import { ListaAccesoriosComponent } from './lista-accesorios/lista-accesorios.component';
import { ContactoComponent } from './contacto/contacto.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CarritoComponent } from './carrito/carrito.component';
import { RealizarPedidoComponent } from './realizar-pedido/realizar-pedido.component';
import { DetallesProductoComponent } from './detalles-producto/detalles-producto.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { AdminProductosComponent } from './admin-productos/admin-productos.component';
import { AdminPedidosComponent } from './admin-pedidos/admin-pedidos.component';

export const routes: Routes = [
	{ path: '', redirectTo: '/principal', pathMatch: 'full' },
	{ path: 'principal', component: PrincipalComponent },
	{ path: 'perfil', component: PerfilComponent },
	{ path: 'carrito', component: CarritoComponent },
	{ path: 'productos', component: ListaProductosComponent },
	{ path: 'productos/moviles', component: ListaMovilesComponent },
	{ path: 'productos/moviles/:marca', component: ListaMovilesComponent },
	{ path: 'productos/accesorios', component: ListaAccesoriosComponent },
	{ path: 'productos/accesorios/:tipoAccesorio', component: ListaAccesoriosComponent },
	{ path: 'realizar-pedido', component: RealizarPedidoComponent },
	{ path: 'contacto', component: ContactoComponent },
	{ path: 'detalles-producto/:id', component: DetallesProductoComponent },
	{ path: 'menu-admin', component: MenuAdminComponent },
	{ path: 'admin-productos', component: AdminProductosComponent },
	{ path: 'admin-pedidos', component: AdminPedidosComponent }
];
