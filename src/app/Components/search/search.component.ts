import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SearchCitiesService } from '../../Services/search-cities.service';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, finalize, map } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../Services/spinner.service';
import { IBusInfo, IInfoBustable } from '../../Models/i-infoViajes';
import { ISearchFilterBus } from '../../Models/i-searchFilter';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../Services/shared-service.service';
import { IParadas, ISubStop } from '../../Models/i-paradas';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  paradas: IParadas[] = [];
  busInfo: IBusInfo[] = [];
  busInfoTable: IInfoBustable[] = [];
  formSearchFilter!: FormGroup;
  isError: boolean = false;
  messageAlert: string = ""
  typeAlertEvent: boolean | null = false;
  isFormFrom: boolean = false;
  subestado!: ISubStop;

  /**
   *
   */
  constructor(private searchCitiesService: SearchCitiesService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedServiceService: SharedServiceService,
    private elementRef: ElementRef
  ) {

  }

  ngOnInit(): void {
    this.onLoad();

    this.formSearchFilter = this.formBuilder.group({
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      travelDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]],
      affiliateCode: 'DDE'
    });

  }

  /**
   * Load initial component
   */
  onLoad(): void {
    this.GetParadas();

  }



  //#region Ciudades

  /**
   * Formato y filtro de typeahead busqueda de ciudades
   * @param result 
   * @returns 
   */
  formatter = (result: IParadas) => result.name?.toUpperCase();

  search: OperatorFunction<string, readonly IParadas[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === '' ? [] : this.paradas.filter((v) => v.name?.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );


  /**
   * Se agrega metodo porque nbgtypeahead se ejecuta 2 veces 1 por el item subparada
   * selecciondada y otro por el padre parada
   */
  SetValue(): void {
    this.isFormFrom ? this.formSearchFilter.get('from')?.setValue(this.subestado) :
      this.formSearchFilter.get('to')?.setValue(this.subestado);
  }

  /**
   * Evento al seleccionar parada
   * @param event 
   */
  onSelectOption(event: any, _typeFrom: boolean, _typeChild: boolean = false): void {
    const selectedItem = event.item as IParadas;
    this.isFormFrom = _typeFrom;

    if (!_typeChild) {
      this.SetValue();

    } else {
      this.subestado = selectedItem;
    }

    if (!selectedItem || (!selectedItem.name.includes("PR") && !selectedItem.name.includes("SP"))) {
      this.typeAlertEvent = _typeFrom;
      this.ShowAlert("Solo se permite estados de SP (São Paulo) y PR (Paraná)");

    }
  }

  ShowAlert(_mesagge: string): void {
    this.isError = true;
    this.messageAlert = _mesagge;
  }

  /**
   * Metodo obtener todas las paradas
   */

  GetParadas(): void {
    this.spinnerService.showSpinner();
    this.searchCitiesService.GetParadas().pipe(
      finalize(() => this.spinnerService.hideSpinner())
    )
      .subscribe({
        next: ((callback) => {

          if (callback && callback.Data) {
            this.paradas = callback.Data;

          }

        }),
        error: ((err) => {
          console.log(err);
        })

      });
  }


  /**
   * Metodo cerrar alerta 
   */
  close(): void {
    this.messageAlert = "";
    if (this.typeAlertEvent != null) {
      this.typeAlertEvent ? this.formSearchFilter.controls["from"].setValue('') :
        this.formSearchFilter.controls["to"].setValue('');
    }
    this.isError = false;
  }


  //#endregion

  //#region Buses por cuidad
  GetBusByCity(): void {
    this.busInfoTable = [];

    if (this.formSearchFilter.invalid) {
      this.typeAlertEvent = null;
      this.ShowAlert("Complete todos lo datos de búsqueda");
      return;
    }

    let searchValues = this.formSearchFilter.getRawValue();


    if (typeof searchValues.from === 'string') {
      this.typeAlertEvent = null;
      this.ShowAlert("Valor de partida no válido.");
      return;
    }

    if (typeof searchValues.to === 'string') {
      this.typeAlertEvent = null;
      this.ShowAlert("Valor de destino no válido.");
      return;
    }

    if (!searchValues.from.name.includes("PR") && !searchValues.from.name.includes("SP")) {
      this.typeAlertEvent = true;
      this.ShowAlert("Solo se permite estados de SP (São Paulo) y PR (Paraná)");
      return;
    }

    if (!searchValues.to.name.includes("PR") && !searchValues.to.name.includes("SP")) {
      this.typeAlertEvent = false;
      this.ShowAlert("Solo se permite estados de SP (São Paulo) y PR (Paraná)");
      return;
    }


    let search = {} as ISearchFilterBus;
    search = searchValues;
    search.from = searchValues.from.id;
    search.to = searchValues.to.id;

    this.spinnerService.showSpinner();


    this.searchCitiesService.GetBusByCity(search).pipe(
      finalize(() => this.spinnerService.hideSpinner())
    )
      .subscribe({
        next: ((callback) => {

          if (callback && callback.Data) {
            this.busInfo = callback.Data;

            this.busInfoTable = this.busInfo.map(x => {
              const arrivaltime = x.arrival.time;
              const departuretime = x.departure.time;

              const [arrivalhour, arrivalminute, arrivalsecond] = arrivaltime.split(":");
              const [departurelhour, departureminute, departuresecond] = departuretime.split(":");

              const formattedTime = `${arrivalhour.padStart(2, '0')}:${arrivalminute.padStart(2, '0')}`;
              const formattedTimeDeparture = `${departurelhour.padStart(2, '0')}:${departureminute.padStart(2, '0')}`;

              return {
                id: x.id,
                company: x.company.name,
                arrival: formattedTime,
                departure: formattedTimeDeparture,
                seatClass: x.seatClass,
                price: x.price.seatPrice,
                from: x.from.name,
                to: x.to.name
              }
            });

          } else {
            this.typeAlertEvent = null;
            this.ShowAlert(`Error consultando viajes. Code: ${callback.Error.Code}, Message: ${callback.Error.Message}`);

          }

        }),
        error: ((err) => {
          console.log(err);
        })

      });
  }
  //#endregion

  //#region Seleccionar Bus

  OnSelectedBus(_bus: IInfoBustable): void {
    this.sharedServiceService.EmitBusSelected(_bus);
    this.router.navigate(['searchSeats']);


  }

  //#region 
}
