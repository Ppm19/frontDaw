import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { MaterialModule } from '../material.module';
import { Producto } from '../models/Producto';
import { ProductosService } from '../productos.service';
import { MenuProductosComponent } from '../menu-productos/menu-productos.component';
import { CarritoService } from '../carrito.service';
import { MatDialog } from '@angular/material/dialog';
import { DetallesProductoComponent } from '../detalles-producto/detalles-producto.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRegistroService } from '../login-registro.service';
import { Usuario } from '../models/Usuario';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-accesorios',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MaterialModule,
    MenuProductosComponent,
    FormsModule,
  ],
  templateUrl: './lista-accesorios.component.html',
  styleUrls: ['./lista-accesorios.component.css']
})
export class ListaAccesoriosComponent implements OnInit, OnDestroy {
  todosLosAccesorios: Producto[] = [];
  productosFiltrados: Producto[] = [];
  terminoBusqueda: string = '';
  isLoading = true;
  errorMensaje: string | null = null;
  private routeSubscription: Subscription | null = null;
  tipoAccesorioActual: string | null = null;
  usuarioActual: Usuario | null = null;
  private usuarioSubscription: Subscription | null = null;

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService,
    private loginRegistroService: LoginRegistroService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.tipoAccesorioActual = params.get('tipoAccesorio');
      this.cargarAccesorios(this.tipoAccesorioActual);
    });

    this.usuarioSubscription = this.loginRegistroService.currentUser$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }

  cargarAccesorios(tipoAccesorio?: string | null): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.productosService.getProductos().subscribe({
      next: (data) => {
        let accesorios = data.filter(producto =>
          producto.categoria?.toLowerCase() !== 'movil'
        );

        if (tipoAccesorio) {
          this.todosLosAccesorios = accesorios.filter(producto =>
            producto.categoria?.toLowerCase() === tipoAccesorio.toLowerCase()
          );
        } else {
          this.todosLosAccesorios = accesorios;
        }
        this.productosFiltrados = [...this.todosLosAccesorios];
        this.isLoading = false;
      },
      error: (err) => {
        const mensajeBase = 'No se pudieron cargar los accesorios';
        const detalleTipo = tipoAccesorio ? ` de tipo ${tipoAccesorio}` : '';
        console.error(`${mensajeBase}${detalleTipo}:`, err);
        this.errorMensaje = `${mensajeBase}${detalleTipo}. Inténtalo de nuevo más tarde.`;
        this.isLoading = false;
      }
    });
  }

  aplicarFiltro(): void {
    if (!this.terminoBusqueda) {
      this.productosFiltrados = [...this.todosLosAccesorios];
    } else {
      this.productosFiltrados = this.todosLosAccesorios.filter((producto) =>
        producto.nombre
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  anadirAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
    this.snackBar.open(`${producto.nombre} añadido al carrito`, 'Cerrar', { duration: 3000 });
  }

  mostrarDetalles(producto: Producto): void {
    this.dialog.open(DetallesProductoComponent, {
      data: { producto: producto },
      width: '800px',
      maxWidth: '90vw',
      autoFocus: false
    });
  }
}
