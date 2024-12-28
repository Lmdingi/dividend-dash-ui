import { DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TransactionService } from './transaction.service';
import { Holding } from '../models/holding.model';
import { Totals } from '../models/totals';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSource = new BehaviorSubject<Holding[]>([]);
  private totalsSource = new BehaviorSubject<Totals>({} as Totals);
  private listCountSource = new BehaviorSubject<number[]>([]);
  listCount = this.listCountSource.asObservable();
  currentData = this.dataSource.asObservable();
  totalsData = this.totalsSource.asObservable();

  constructor(
    private transactionService: TransactionService,
    private destroyRef: DestroyRef
  ) {}

  updateData(
    sortBy?: string,
    sortDirection?: string,
    pageNumber?: number,
    pageSize?: number
  ) {
    const transactionSubscription = this.transactionService
      .getAllTransactions(sortBy, sortDirection, pageNumber, pageSize)
      .subscribe({
        next: (response) => {
          this.dataSource.next(response);
        },
        error: (err) => {
          console.error(err);
        },
      });

    const totalsSubscription = this.transactionService.getTotals().subscribe({
      next: (response) => {
        const count = Math.ceil(response.allHoldingsCount / 4);
        const list: number[] = [];
        for (let i = 0; i < count; i++) {
          list.push(i + 1);
        }

        this.listCountSource.next(list);
        this.totalsSource.next(response);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
      totalsSubscription.unsubscribe();
    });
  }
}
