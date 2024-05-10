import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './Components/search/search.component';
import { AsientosComponent } from './Components/asientos/asientos.component';

const routes: Routes = [
    { path: '', redirectTo: '/search', pathMatch: 'full' },   
    {path:"search", component:SearchComponent},
    {path: "searchSeats", component: AsientosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
