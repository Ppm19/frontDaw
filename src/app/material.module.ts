import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';

const materialModules = [
	MatToolbarModule,
	MatButtonModule,
	MatIconModule,
	MatExpansionModule,
	MatDialogModule,
	MatFormFieldModule,
	MatInputModule,
	MatMenuModule,
	MatCardModule,
	MatTabsModule,
	MatSelectModule,
	MatProgressSpinnerModule,
	MatTableModule,
	MatSnackBarModule,
	MatTooltipModule,
	MatListModule,
	MatStepperModule
];

@NgModule({
	declarations: [],
	imports: [ CommonModule, ...materialModules ],
	exports: [ ...materialModules ]
})
export class MaterialModule {}
