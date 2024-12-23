import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Holding } from '../models/holding.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  transactionUrl = environment.apiBaseUrl + 'transaction';
  currentVisible?: HTMLElement;
  isVisible: boolean = false;

  constructor(private http: HttpClient) {}

  getAllTransactions(
    sortBy?: string,
    sortDirection?: string
  ): Observable<Holding[]> {
    let params = new HttpParams();
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
    }
    return this.http.get<Holding[]>(this.transactionUrl, { params: params });
  }

  getTransactionById(id: string): Observable<Holding> {
    return this.http.get<Holding>(`${this.transactionUrl}/${id}`);
  }

  updateTransaction(holding: Holding): Observable<Holding> {
    return this.http.put<Holding>(`${this.transactionUrl}`, holding);
  }

  createTransaction(holding?: Holding): Observable<Holding> {
    return this.http.post<Holding>(`${this.transactionUrl}`, holding);
  }

  deleteTransactionById(holdingId?: string): Observable<Holding> {
    return this.http.delete<Holding>(`${this.transactionUrl}/${holdingId}`);
  }

  collopsRow(row: HTMLElement) {
    if (this.isVisible) {
      if (row.style.display === '') {
        row.style.display = 'none';
        this.isVisible = false;
        return;
      }

      if (this.currentVisible) {
        this.currentVisible.style.display = 'none';
      }
    }

    row.style.display = '';
    this.currentVisible = row;
    this.isVisible = true;
  }
}
