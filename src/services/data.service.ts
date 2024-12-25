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
  currentData = this.dataSource.asObservable();
  totalsData = this.totalsSource.asObservable();

  constructor(
    private transactionService: TransactionService,
    private destroyRef: DestroyRef
  ) {}

  updateData(sortBy?: string, sortDirection?: string) {
    const transactionSubscription = this.transactionService
      .getAllTransactions(sortBy, sortDirection)
      .subscribe({
        next: (response) => {
          this.dataSource.next(response);
        },
        error: (err) => {
          console.error(err);
        },
      });

    const totals = this.transactionService.getTotals().subscribe({
      next: (response) => {
        this.totalsSource.next(response);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
    });
  }
}
