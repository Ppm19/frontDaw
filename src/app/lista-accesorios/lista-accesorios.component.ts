import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';

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
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
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
        const mensajeBase = 'Error al cargar los accesorios';
        const detalleTipo = tipoAccesorio ? ` de tipo ${tipoAccesorio}` : '';
        if (isPlatformBrowser(this.platformId)) {
          console.error(`${mensajeBase}${detalleTipo}:`, err);
        } else {
          console.error(`${mensajeBase}${detalleTipo} (SSR):`, err.message);
        }
        this.errorMensaje = `No se pudieron cargar los accesorios${detalleTipo}. Inténtalo de nuevo más tarde.`;
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
