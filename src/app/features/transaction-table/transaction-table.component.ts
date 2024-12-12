import { Component, DestroyRef, OnInit } from '@angular/core';
import { type Holding } from '../../../models/holding.model';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, TransactionDetailComponent, AddTransactionComponent],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnInit {
  holdings: Holding[] = [];

  constructor(
    private transactionService: TransactionService,
    private destroyRef: DestroyRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const transactionSubscription = this.transactionService
      .getAllTransactions()
      .subscribe({
        next: (response) => {
          this.holdings = response;
        },
      });

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
    });
  }

  onDetails(details: HTMLElement): void {
    this.transactionService.collopsRow(details);
  }

  onAdd(newHoldingForm: HTMLElement): void {
    this.transactionService.collopsRow(newHoldingForm);
  }
}
