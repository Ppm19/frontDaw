import { Component, HostListener, Renderer2, ElementRef, ViewChild, Inject, PLATFORM_ID, OnDestroy, Injector, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MaterialModule } from '../material.module';
import { MatToolbar } from '@angular/material/toolbar';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { LoginRegistroService } from '../login-registro.service';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Usuario } from '../models/Usuario';

@Component({
  selector: 'app-menu-inicio',
  standalone: true,
  imports: [ CommonModule, MaterialModule, RouterLink ],
  templateUrl: './menu-inicio.component.html',
  styleUrls: ['./menu-inicio.component.css']
})
export class MenuInicioComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatToolbar, { read: ElementRef }) private matToolbar!: ElementRef;

  private previousScrollState: boolean = false;
  private routerSubscription?: Subscription;
  private dialogRef?: MatDialogRef<LoginModalComponent>;

  currentUser: Usuario | null = null;
  isAuthenticated: boolean = false;
  private authSubscription?: Subscription;

  mobileMenuOpen = false;
  isMobile = false;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog,
    private loginRegistroService: LoginRegistroService,
    private injector: Injector,
    private router: Router
  ) {
    this.authSubscription = this.loginRegistroService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.authSubscription.add(this.loginRegistroService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    }));
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener('resize', this.onResize);
    }
    this.routerSubscription = this.router.events.pipe(
      startWith(new NavigationEnd(0, this.router.url, this.router.url)),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkMenuScrollState();
    });
  }

  ngAfterViewInit(): void {
    this.checkMenuScrollState();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkMenuScrollState();
  }

  private checkMenuScrollState(): void {
    if (isPlatformBrowser(this.platformId) && this.matToolbar) {
      const principalContainer = document.querySelector('.principal-container') as HTMLElement;
      let currentState = false;

      if (principalContainer) {
        const principalContainerHeight = principalContainer.offsetHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        currentState = scrollPosition > principalContainerHeight * 0.5;
      } else {
        currentState = true;
      }

      if (currentState !== this.previousScrollState) {
        if (currentState) {
          this.renderer.addClass(this.matToolbar.nativeElement, 'menu-scrolled');
        } else {
          this.renderer.removeClass(this.matToolbar.nativeElement, 'menu-scrolled');
        }
        this.previousScrollState = currentState;
      }
    } else if (isPlatformBrowser(this.platformId) && this.matToolbar && !document.querySelector('.principal-container')){
        if (!this.previousScrollState) {
            this.renderer.addClass(this.matToolbar.nativeElement, 'menu-scrolled');
            this.previousScrollState = true;
        }
    }
  }

  toggleLoginDropdown(): void {
    if (this.dialogRef && this.dialogRef.componentInstance) {
        console.log('Login dialog is already open.');
        return;
    }
    this.openLoginDialog();
  }

  openLoginDialog(): void {
    this.dialogRef = this.dialog.open(LoginModalComponent, {
      width: '480px',
      data: {
        isAuthenticated: this.isAuthenticated,
        currentUser: this.currentUser
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('Login dialog closed with result:', result);
      if (result) {
        if (result.success && result.usuario) {
          console.log('Intento de login exitoso. Estado actualizado por servicio.');
          if (this.loginRegistroService.currentUserValue?.tipo === 'admin') {
            this.router.navigate([ '/menu-admin' ]);
          } else {
            this.router.navigate([ '/principal' ]);
          }
        } else if (result.reason === 'profile') {
          console.log('Navegando a perfil...');
          this.router.navigate(['/perfil']);
        } else if (result.reason === 'logout') {
          console.log('Logout realizado desde modal.');
        } else if (result.reason === 'cancel'){
          console.log('Panel cerrado por cancelación.');
        }
      } else {
        console.log('Login dialog closed without specific result (e.g., for opening register dialog).');
      }
      this.dialogRef = undefined;
    });
  }

  @HostListener('window:resize')
  onResize = (): void => {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.mobileMenuOpen = false;
      }
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
        this.dialogRef.close();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }
}
