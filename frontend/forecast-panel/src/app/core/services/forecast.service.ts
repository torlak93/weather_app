import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpRequest,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  constructor(private httpClient: HttpClient) {}

  names = [
    'AVG TEMPERATURE',
    'MAX TEMPERATURE',
    'MAX WIND',
    'MAX HUMIDITY',
    'AVG MEANPRESSURE',
  ];

  apiUrl = 'http://localhost:5000';

  getLastForecast(): Observable<any> {
    return this.httpClient.get('http://localhost:5000/last-forecast');
  }

  getStatistics(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/today-statistics`).pipe(
      map((res) => {
        return res[0];
      }),
      map((res) => {
        res = Object.keys(res).reduce((arr, key) => {
          const name = this.names.find((name) =>
            name.toLocaleLowerCase().replace(' ', '_').includes(key)
          );
          let obj = { name: name, value: res[key] };
          return arr.concat(obj);
        }, []);

        return res;
      })
    );
  }

  getForecast(
    location,
    time: string,
    from: string,
    to: string,
    isGapfill: boolean,
    measure?: string
  ): Observable<any> {
    let params = new HttpParams();

    params = params.append('location', location);
    params = params.append('time', time);
    params = params.append('from', from);
    params = params.append('measure', measure || 'meantemp');
    params = params.append('to', to.concat('T23:59:00.000'));

    if (isGapfill) {
      params = params.append('isGapfill', '1');
    }

    let httpOptions = {
      params: params,
    };

    return this.httpClient.get<any>(`${this.apiUrl}/forecast`, httpOptions);
  }

  getForecastLocf(
    location,
    time: string,
    from: string,
    to: string,
    measure?: string
  ): Observable<any> {
    let params = new HttpParams();

    params = params.append('location', location);
    params = params.append('time', time);
    params = params.append('from', from);
    params = params.append('measure', measure || 'meantemp');
    params = params.append('to', to.concat('T23:59:00.000'));

    let httpOptions = {
      params: params,
    };

    return this.httpClient.get<any>(`${this.apiUrl}/locf`, httpOptions);
  }

  getLastMeasurements(
    location,
    time: string,
    from: string,
    to: string,
    isGapfill: boolean,
    measure?: string,
    type?: string
  ): Observable<any> {
    let params = new HttpParams();

    params = params.append('location', location);
    params = params.append('time', time);
    params = params.append('from', from);
    params = params.append('measure', measure || 'meantemp');
    params = params.append('measureType', type || 'last');
    params = params.append('to', to.concat('T23:59:00.000'));

    if (isGapfill) {
      params = params.append('isGapfill', '1');
    }

    let httpOptions = {
      params: params,
    };

    return this.httpClient.get<any>(
      'http://localhost:5000/forecast-first-last',
      httpOptions
    );
  }

  getDestinations(): Observable<any> {
    return this.httpClient.get('http://localhost:5000/prices');
  }

  getMinMaxTemperature(type): Observable<any> {
    let params = new HttpParams();

    params = params.append('type', type);

    let httpOptions = {
      params: params,
    };

    return this.httpClient.get(
      'http://localhost:5000/min-max-temperature',
      httpOptions
    );
  }

  getDaysCount(temp, year): Observable<any> {
    let params = new HttpParams();

    params = params.append('temp', temp);
    params = params.append('from', `${year}-01-01`);
    params = params.append('to', `${year}-12-31`);

    let httpOptions = {
      params: params,
    };

    return this.httpClient
      .get<any>('http://localhost:5000/count-days', httpOptions)
      .pipe(
        map((res) => {
          let data = [
            {
              name: 'above',
              value: +res[0]['above'],
            },
            {
              name: 'below',
              value: +res[0]['below'],
            },
          ];

          return data;
        })
      );
  }

  newForecast(body): Observable<any> {
    return this.httpClient.post('http://localhost:5000/forecast', body);
  }
}
