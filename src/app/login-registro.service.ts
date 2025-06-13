import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Usuario } from './models/Usuario';
import { Router } from '@angular/router';
import { environment } from './environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class LoginRegistroService {
	private apiUrl = `${environment.apiUrl}/usuarios`;
	private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

	private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
	public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

	constructor(private http: HttpClient, private router: Router) {
		this.loadInitialAuthState();
	}

	private loadInitialAuthState(): void {
		if (typeof sessionStorage !== 'undefined') {
			const storedUser = sessionStorage.getItem('currentUser');
			if (storedUser) {
				const user: Usuario = JSON.parse(storedUser);
				this.currentUserSubject.next(user);
				this.isAuthenticatedSubject.next(true);
			}
		}
	}

	login(credentials: { email: string; password: string }): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
			tap((response: any) => {
				if (response && response.usuario) {
					if (typeof sessionStorage !== 'undefined') {
						sessionStorage.setItem('currentUser', JSON.stringify(response.usuario));
					}
					this.currentUserSubject.next(response.usuario as Usuario);
					this.isAuthenticatedSubject.next(true);
					console.log('Login Service: Usuario guardado en session', response.usuario);
					console.log('Login Service: Mensaje del backend', response.message);
				} else if (response && response.message) {
					console.log('Login Service: Mensaje del backend (sin usuario)', response.message);
				}
			}),
			catchError(this.handleError)
		);
	}

	logout(): void {
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.removeItem('currentUser');
		}
		this.currentUserSubject.next(null);
		this.isAuthenticatedSubject.next(false);
		console.log('Logout Service: Usuario eliminado de session');
	}

	public get currentUserValue(): Usuario | null {
		return this.currentUserSubject.value;
	}

	actualizarUsuario(userId: string, datosActualizar: Partial<Usuario>): Observable<Usuario> {
		return this.http.put<any>(`${this.apiUrl}/${userId}`, datosActualizar).pipe(
			tap((response: any) => {
				if (response && response.usuario) {
					const usuarioActualizado = response.usuario as Usuario;
					if (typeof sessionStorage !== 'undefined') {
						sessionStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));
					}
					this.currentUserSubject.next(usuarioActualizado);
					console.log('LoginRegistroService: Usuario actualizado y guardado en session', usuarioActualizado);
				} else {
					console.warn(
						'LoginRegistroService: Respuesta de actualización de usuario no contenía el objeto usuario esperado.',
						response
					);
				}
			}),
			catchError(this.handleError)
		);
	}

	registrarUsuario(datosUsuario: Usuario): Observable<any> {
		return this.http.post<any>(this.apiUrl, datosUsuario).pipe(
			tap((response) => {
				console.log('Servicio LoginRegistro: Respuesta de registro', response);
			}),
			catchError(this.handleError)
		);
	}

	private handleError(error: HttpErrorResponse) {
		let errorMessage = 'Ocurrió un error desconocido durante la autenticación.';
		if (error.error instanceof ErrorEvent) {
			errorMessage = `Error: ${error.error.message}`;
		} else {
			if (error.error && error.error.message) {
				errorMessage = error.error.message;
			} else {
				errorMessage = `Error ${error.status}: ${error.statusText}`;
			}
		}
		console.error('AuthService handleError:', errorMessage, error);
		return throwError(() => new Error(errorMessage));
	}
}
