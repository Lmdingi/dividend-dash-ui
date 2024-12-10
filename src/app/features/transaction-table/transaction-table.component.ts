import { Component, DestroyRef, OnInit } from '@angular/core';
import { Holding } from '../../../models/holding.model';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnInit {
  holdings: Holding[] = [];

  constructor(
    private transactionService: TransactionService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    const transactionSubscription = this.transactionService
      .getAllTransactions()
      .subscribe({
        next: (response) => {
          this.holdings = response;
          console.log(response);
        },
      });

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
    });
  }
}
