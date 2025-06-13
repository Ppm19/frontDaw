import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito.service';
import { LoginRegistroService } from '../login-registro.service';
import { PedidosService } from '../pedidos.service';
import { ItemCarrito } from '../models/Carrito';
import { Usuario } from '../models/Usuario';
import { ArticuloPedido } from '../models/ArticuloPedido';

@Component({
  selector: 'app-realizar-pedido',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './realizar-pedido.component.html',
  styleUrl: './realizar-pedido.component.css'
})
export class RealizarPedidoComponent implements OnInit, OnDestroy {
  pedidoForm!: FormGroup;
  itemsCarrito: ItemCarrito[] = [];
  totalCarrito: number = 0;
  usuarioActual: Usuario | null = null;
  isLoading: boolean = false;
  selectedAddress: string = '';

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private carritoService: CarritoService,
    private loginRegistroService: LoginRegistroService,
    private pedidosService: PedidosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pedidoForm = this.fb.group({
      nombreCompletoComprador: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
      emailComprador: ['', [Validators.required, Validators.email]],
      telefonoComprador: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{9,15}$')],
      ],
      direccionEnvio: [
        '',
        [Validators.required, Validators.minLength(5)],
      ],
    });

    const carritoSub = this.carritoService.carritoActual$.subscribe((carrito) => {
      if (carrito) {
        this.itemsCarrito = carrito.items;
        this.totalCarrito = carrito.total;
        if (this.itemsCarrito.length === 0 && !this.isLoading) {
          console.warn(
            'El carrito está vacío. Considera redirigir al usuario.'
          );
        }
      }
    });
    this.subscriptions.add(carritoSub);

    const userSub = this.loginRegistroService.currentUser$.subscribe((user) => {
      this.usuarioActual = user;
      if (user) {
        let nombreCompleto = user.nombre;
        if (user.primerApellido) {
          nombreCompleto += ` ${user.primerApellido}`;
        }
        if (user.segundoApellido) {
          nombreCompleto += ` ${user.segundoApellido}`;
        }

        this.pedidoForm.patchValue({
          nombreCompletoComprador: nombreCompleto.trim(),
          emailComprador: user.email,
          telefonoComprador: user.telefono,
        });
        this.selectedAddress = '';
      } else {
        this.pedidoForm.reset();
        this.selectedAddress = '';
      }
    });
    this.subscriptions.add(userSub);
  }

  onAddressSelect(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue) {
      this.selectedAddress = selectedValue;
      this.pedidoForm.patchValue({ direccionEnvio: selectedValue });
    } else {
      this.selectedAddress = '';
      this.pedidoForm.patchValue({ direccionEnvio: '' });
    }
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }

    if (this.itemsCarrito.length === 0) {
      return;
    }

    this.isLoading = true;
    const formValues = this.pedidoForm.value;

    const articulosParaPedido: ArticuloPedido[] = this.itemsCarrito.map(
      (item) => ({
        productoId: {
          _id: item.producto._id!,
          nombre: item.producto.nombre,
          imagenes: item.producto.imagenes,
        },
        nombreProducto: item.producto.nombre,
        cantidad: item.cantidad,
        precioAlComprar: item.producto.precio,
        imagenPrincipal:
          item.producto.imagenes && item.producto.imagenes.length > 0
            ? item.producto.imagenes[0]
            : undefined,
      })
    );

    const datosPedidoPayload = {
      usuario: this.usuarioActual ? this.usuarioActual._id : null,
      nombreCompletoComprador: formValues.nombreCompletoComprador,
      emailComprador: formValues.emailComprador,
      telefonoComprador: formValues.telefonoComprador,
      direccionEnvio: formValues.direccionEnvio,
      articulos: articulosParaPedido,
      totalPedido: this.totalCarrito,
    };

    const pedidoSub = this.pedidosService
      .crearPedido(datosPedidoPayload)
      .subscribe({
        next: (pedidoGuardado) => {
          this.isLoading = false;
          this.carritoService.limpiarCarrito();
          this.pedidoForm.reset();
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al crear el pedido:', err);
        },
      });
    this.subscriptions.add(pedidoSub);
  }

  get nombreCompletoComprador() {
    return this.pedidoForm.get('nombreCompletoComprador');
  }
  get emailComprador() {
    return this.pedidoForm.get('emailComprador');
  }
  get telefonoComprador() {
    return this.pedidoForm.get('telefonoComprador');
  }
  get direccionEnvio() {
    return this.pedidoForm.get('direccionEnvio');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
