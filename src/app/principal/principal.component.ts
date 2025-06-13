import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MaterialModule } from '../material.module';
import { MenuInicioComponent } from '../menu-inicio/menu-inicio.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';

interface MarcaLogo {
	src: string;
	alt: string;
}

@Component({
	selector: 'app-principal',
	standalone: true,
	imports: [ CommonModule, MaterialModule, MenuInicioComponent, FooterComponent, RouterLink ],
	templateUrl: './principal.component.html',
	styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit, OnDestroy {
	logosMarcas: MarcaLogo[] = [
		{ src: '../../assets/imagenes/logos-marcas/logo-apple.png', alt: 'Logo Apple' },
		{ src: '../../assets/imagenes/logos-marcas/logo-google.png', alt: 'Logo Google' },
		{ src: '../../assets/imagenes/logos-marcas/logo-huawei.png', alt: 'Logo Huawei' },
		{ src: '../../assets/imagenes/logos-marcas/logo-sansumg.png', alt: 'Logo Samsung' },
		{ src: '../../assets/imagenes/logos-marcas/logo-xiaomi.png', alt: 'Logo Xiaomi' }
	];

	currentLogoIndex = 0;
	private intervalId?: number | any;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId) && this.logosMarcas.length > 0) {
			this.startCarousel();
		}
	}

	startCarousel(): void {
		this.intervalId = setInterval(() => {
			this.nextLogo();
		}, 3000);
	}

	nextLogo(): void {
		if (this.logosMarcas.length > 0) {
			this.currentLogoIndex = (this.currentLogoIndex + 1) % this.logosMarcas.length;
		}
	}

	ngOnDestroy(): void {
		if (isPlatformBrowser(this.platformId) && this.intervalId) {
			clearInterval(this.intervalId);
		}
	}
}
