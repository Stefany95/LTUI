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

  /**
   * Metodo para mapear pocision de div en posision x
   * @param x 
   * @returns 
   */
  GetGridColumn(x: number): string {
    return `${x + 1} / span 1`;
  }

  /**
   * Metodo para mapear pocision de div en posision y
   */
  GetGridRow(y: number): string {
    return `${y + 1} / span 1`;
  }


/**
 * Metodo que se ejecuta al seleccionar asientos disponibles
 * @param _seat 
 */
  SelectAsiento(_seat: IAsientos) {
    _seat.selected = !_seat.selected;

    let cantAsiento = this.asientos.filter(x => x.selected).length;

    this.TotalPrice = this.busSelected && this.busSelected?.price > 0 && cantAsiento > 1 ? +(this.busSelected.price * cantAsiento).toFixed(2) : this.busSelected?.price;

    this.asientosFiltered = this.asientos.filter(x => x.selected);
  }


  /**
   * Metodo obtener asientos por travelId
   */
  GetAsientos(): void {
    if (this.busSelected && this.busSelected.id) {

      let search = {
        travelId: this.busSelected.id,
        type: "list",
        orientation: "horizontal"

      } as ISearchFilterAsientos;

      this.spinnerService.showSpinner();
      this.searchCitiesService.GetAsientos(search).pipe(
        finalize(() => this.spinnerService.hideSpinner())
      )
        .subscribe({
          next: ((callback) => {

            if (callback && callback.Data) {
              this.asientos = callback.Data;

              this.asientos.map(x => {

                if (x.seat == "") {
                  x.seat = 'X';
                }
                return { ...x, }
              });
            }

          }),
          error: ((err) => {
            console.log(err);
          })

        });
    }

  }


}
