import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router';
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
  selector: 'app-lista-moviles',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MaterialModule,
    MenuProductosComponent,
    FormsModule,
  ],
  templateUrl: './lista-moviles.component.html',
  styleUrls: ['./lista-moviles.component.css']
})
export class ListaMovilesComponent implements OnInit, OnDestroy {
  todosLosMoviles: Producto[] = [];
  productosFiltrados: Producto[] = [];
  terminoBusqueda: string = '';
  isLoading = true;
  errorMensaje: string | null = null;
  private routeSubscription: Subscription | null = null;
  marcaActual: string | null = null;
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
      this.marcaActual = params.get('marca');
      this.cargarMoviles(this.marcaActual);
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

  cargarMoviles(marca?: string | null): void {
    this.isLoading = true;
    this.errorMensaje = null;
    const filtros: { categoria: string; marca?: string } = {
      categoria: 'movil',
    };
    if (marca) {
      filtros.marca = marca;
    }

    this.productosService.getProductos(filtros).subscribe({
      next: (data) => {
        if (marca) {
          this.todosLosMoviles = data.filter(
            (producto) =>
              producto.categoria?.toLowerCase() === 'movil' &&
              producto.marca?.toLowerCase() === marca.toLowerCase()
          );
        } else {
          this.todosLosMoviles = data.filter(
            (producto) => producto.categoria?.toLowerCase() === 'movil'
          );
        }
        this.productosFiltrados = [...this.todosLosMoviles];
        this.isLoading = false;
      },
      error: (err) => {
        const mensajeError = `Error al cargar móviles ${
          marca ? 'de la marca ' + marca : ''
        }`;
        if (isPlatformBrowser(this.platformId)) {
          console.error(mensajeError + ':', err);
        } else {
          console.error(mensajeError + ' (SSR):', err.message);
        }
        this.errorMensaje = `${mensajeError}. Inténtalo de nuevo más tarde.`;
        this.isLoading = false;
      },
    });
  }

  aplicarFiltro(): void {
    if (!this.terminoBusqueda) {
      this.productosFiltrados = [...this.todosLosMoviles];
    } else {
      this.productosFiltrados = this.todosLosMoviles.filter((producto) =>
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
