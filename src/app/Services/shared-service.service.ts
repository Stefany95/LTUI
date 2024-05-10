import { Injectable } from '@angular/core';
import { IInfoBustable } from '../Models/i-infoViajes';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {


  private valueBusSelected = new BehaviorSubject<IInfoBustable | null>(null);
  valueBusSelected$ = this.valueBusSelected.asObservable();

  constructor() { }

  EmitBusSelected(bus: IInfoBustable): void {
    this.valueBusSelected.next(bus);
  }

  GetBusSelected(): Observable<IInfoBustable | null> {
    return this.valueBusSelected.asObservable();
  }
 
}
