import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Pedido } from '../app/models/Pedido';
import { environment } from './environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  crearPedido(datosPedido: any): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, datosPedido).pipe(
      tap(response => {
        console.log('Pedido creado con éxito desde el servicio:', response);
      }),
      catchError(this.handleError)
    );
  }

  getPedidosPorUsuario(usuarioId: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}?usuarioId=${usuarioId}`).pipe(
      tap(response => {
        console.log('Pedidos obtenidos para el usuario:', response);
      }),
      catchError(this.handleError)
    );
  }

  getPedidos(estado?: string): Observable<Pedido[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<Pedido[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  actualizarPedido(id: string, actualizaciones: Partial<Pedido>): Observable<Pedido> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Pedido>(url, actualizaciones).pipe(
      catchError(this.handleError)
    );
  }

  eliminarPedido(id: string): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<{}>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error en PedidosService:', error);
    return throwError(() => new Error(error.error?.message || error.message || 'Error desconocido en el servicio de pedidos'));
  }
}