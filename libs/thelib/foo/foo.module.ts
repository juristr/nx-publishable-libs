import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooComponent } from './foo.component';

const moduleDependencies = [];

@NgModule({
  declarations: [FooComponent],
  imports: [CommonModule, ...moduleDependencies],
  exports: [FooComponent],
})
export class TheLibFooModule {}
