import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBusInfo } from '../Models/i-infoViajes';
import { ISearchFilterAsientos, ISearchFilterBus} from '../Models/i-searchFilter';
import { IAsientos } from '../Models/i-asientos';
import { IResponse } from '../Models/i-response';
import { IParadas } from '../Models/i-paradas';

@Injectable({
  providedIn: 'root'
})
export class SearchCitiesService {

  constructor(private httpClient: HttpClient) { }
 
  private BaseURL = 'https://localhost:7143/api/Search/'

  GetParadas(): Observable<IResponse<IParadas[]>>{   
    return this.httpClient.get<IResponse<IParadas[]>>(`${this.BaseURL}GetParadas`);
  }

  GetBusByCity(_search: ISearchFilterBus): Observable<IResponse<IBusInfo[]>>{   
    return this.httpClient.post<IResponse<IBusInfo[]>>(`${this.BaseURL}GetBusByCity`,_search);
  }

  GetAsientos(_search: ISearchFilterAsientos): Observable<IResponse<IAsientos[]>>{   
    return this.httpClient.post<IResponse<IAsientos[]>>(`${this.BaseURL}GetAsientos`,_search);
  }
}
