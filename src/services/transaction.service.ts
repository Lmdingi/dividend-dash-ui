import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Holding } from '../models/holding.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  transactionUrl = environment.apiBaseUrl + 'transaction';

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Holding[]> {
    return this.http.get<Holding[]>(this.transactionUrl);
  }

  getTransactionById(id: string): Observable<Holding> {
    return this.http.get<Holding>(`${this.transactionUrl}/${id}`);
  }
}
