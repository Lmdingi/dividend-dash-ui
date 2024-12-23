import { DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TransactionService } from './transaction.service';
import { Holding } from '../models/holding.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSource = new BehaviorSubject<Holding[]>([]);
  currentData = this.dataSource.asObservable();

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

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
    });
  }
}
