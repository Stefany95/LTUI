import { Component, OnInit } from '@angular/core';
import { SearchCitiesService } from '../../Services/search-cities.service';
import { SpinnerService } from '../../Services/spinner.service';
import { Subscription, finalize } from 'rxjs';
import { IAsientos } from '../../Models/i-asientos';
import { IInfoBustable } from '../../Models/i-infoViajes';
import { ISearchFilterAsientos } from '../../Models/i-searchFilter';
import { SharedServiceService } from '../../Services/shared-service.service';

@Component({
  selector: 'app-asientos',
  templateUrl: './asientos.component.html',
  styleUrl: './asientos.component.css'
})
export class AsientosComponent implements OnInit {
  asientos: IAsientos[] = [];
  asientosFiltered: IAsientos[] = [];
  busSelected!: IInfoBustable;
  TotalPrice: number = 0;
  private subscription: Subscription;
  constructor(private searchCitiesService: SearchCitiesService,
    private spinnerService: SpinnerService,
    private sharedServiceService: SharedServiceService,
  ) {
    this.subscription = this.sharedServiceService.valueBusSelected$.subscribe(res => {
      if (res) {
        this.busSelected = res;
        this.TotalPrice = this.busSelected.price;
      }
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.GetAsientos();
  }

  SelectAsiento(_seat: IAsientos) {
    _seat.selected = !_seat.selected;

    let cantAsiento = this.asientos.filter(x => x.selected).length;

    this.TotalPrice = this.busSelected && this.busSelected?.price > 0 && cantAsiento > 1 ? this.busSelected.price * cantAsiento :this.busSelected?.price ;

   this.asientosFiltered = this.asientos.filter(x=> x.selected);
  }

  GetAsientos(): void {
    //if (this.busSelected && this.busSelected.id) {

    let search = {
      travelId: "1_1db559a905427833b844c85188db9049",//this.busSelected.id,
      type: "list",
      orientation: "vertical"

    } as ISearchFilterAsientos;

    this.spinnerService.showSpinner();
    this.searchCitiesService.GetAsientos(search).pipe(
      finalize(() => this.spinnerService.hideSpinner())
    )
      .subscribe({
        next: ((callback) => {

          if (callback && callback.Data) {
            this.asientos = callback.Data;
           

            this.asientos.map(x=>{

              if(x.seat == ""){
                x.seat = 'X';
              }

              return{...x} 
            });
          }

        }),
        error: ((err) => {
          console.log(err);
        })

      });
  }

  //}


}
