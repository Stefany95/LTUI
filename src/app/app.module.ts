import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './Components/search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './Components/Shared/spinner/spinner.component';
import { AsientosComponent } from './Components/asientos/asientos.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SpinnerComponent,
    AsientosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
