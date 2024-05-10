import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }
  
  private blockUI = new BehaviorSubject<boolean>(false);
  spinnerVisible$ = this.blockUI.asObservable();

  showSpinner() {
    this.blockUI.next(true);
  }

  hideSpinner() {
    this.blockUI.next(false);
  }
}
