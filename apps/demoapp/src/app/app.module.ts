import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TheLibFooModule } from '@myorg/thelib/foo';
import { TheLibBarModule } from '@myorg/thelib/bar';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TheLibFooModule, TheLibBarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
