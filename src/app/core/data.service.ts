import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { ICustomer, IOrder } from '../shared/interfaces';

@Injectable()
export class DataService {

    baseUrl: string = 'assets/';
    
    constructor(private http: HttpClient) { }

    getCustomers() : Observable<ICustomer[]>{
        return this.http.get<ICustomer[]>(this.baseUrl + 'customers.json').pipe(catchError(this.handleError));
    }

    getCustomer(id: number) : Observable<ICustomer> {
        return this.http.get<ICustomer[]>(this.baseUrl + 'customers.json').pipe(map(customers => {
            let customer = customers.filter((cust: ICustomer) => cust.id === id);
            return (customer && customer.length) ? customer[0] : null as any;
        }),
        catchError(this.handleError))
    }

    getOrders(id: number) : Observable<IOrder[]> {
        return this.http.get<IOrder[]>(this.baseUrl + 'orders.json')
          .pipe(
            map(orders => {
              let custOrders = orders.filter((order: IOrder) => order.customerId === id);
              return custOrders;
            }),
            catchError(this.handleError)
          );
      }
  
      private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          console.error('An error occurred:', error.error);
        } else {
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        return throwError(
          'Something bad happened; please try again later.');
      }


}