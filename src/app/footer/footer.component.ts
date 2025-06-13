import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-footer',
	standalone: true,
	imports: [ CommonModule, MaterialModule, RouterModule ],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.css'
})
export class FooterComponent {
	currentYear: number = new Date().getFullYear();
}
