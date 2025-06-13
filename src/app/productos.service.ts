import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Producto } from './models/Producto';
import { environment } from './environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class ProductosService {
	private apiUrl = `${environment.apiUrl}/productos`;

	constructor(private http: HttpClient) {}

	getProductos(filtros?: { categoria?: string; marca?: string; precioMax?: number }): Observable<Producto[]> {
		let params = new HttpParams();
		if (filtros) {
			if (filtros.categoria) {
				params = params.set('categoria', filtros.categoria);
			}
			if (filtros.marca) {
				params = params.set('marca', filtros.marca);
			}
			if (filtros.precioMax !== undefined) {
				params = params.set('precioMax', filtros.precioMax.toString());
			}
		}

		return this.http.get<Producto[]>(this.apiUrl, { params }).pipe(catchError(this.handleError));
	}

	getProductoPorId(id: string): Observable<Producto> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.get<Producto>(url).pipe(catchError(this.handleError));
	}

	crearProducto(producto: Producto): Observable<{ message: string; producto: Producto }> {
		return this.http
			.post<{ message: string; producto: Producto }>(this.apiUrl, producto)
			.pipe(catchError(this.handleError));
	}

	actualizarProducto(id: string, producto: Partial<Producto>): Observable<{ message: string; producto: Producto }> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.put<{ message: string; producto: Producto }>(url, producto).pipe(catchError(this.handleError));
	}

	eliminarProducto(id: string): Observable<{ message: string; producto: Producto }> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.delete<{ message: string; producto: Producto }>(url).pipe(catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
		let errorMessage = 'Ocurrió un error desconocido.';
		if (error.error instanceof ErrorEvent) {
			errorMessage = `Error: ${error.error.message}`;
		} else {
			console.error(
				`Backend devolvió código ${error.status}, ` + `cuerpo del error: ${JSON.stringify(error.error)}`
			);
			errorMessage = `Error del servidor: ${error.status}. ${error.error.message ||
				''} Detalles: ${JSON.stringify(error.error.errors || error.error)}`;
		}
		return throwError(() => new Error(errorMessage));
	}
}
