import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar.component';

const moduleDependencies = [];

@NgModule({
  declarations: [BarComponent],
  imports: [CommonModule, ...moduleDependencies],
  exports: [BarComponent],
})
export class TheLibBarModule {}
