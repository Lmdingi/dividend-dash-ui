import { Component, DestroyRef, OnInit } from '@angular/core';
import { type Holding } from '../../../models/holding.model';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, TransactionDetailComponent, AddTransactionComponent],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnInit {
  data: any;
  holdings: Holding[] = [];

  constructor(
    private dataService: DataService,
    private transactionService: TransactionService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    const dataSubscription = this.dataService.currentData.subscribe(
      (updatedData) => {
        this.holdings = updatedData;
      }
    );

    this.dataService.updateData();

    this.destroyRef.onDestroy(() => {
      dataSubscription.unsubscribe();
    });
  }

  onDetails(details: HTMLElement): void {
    this.transactionService.collopsRow(details);
  }

  onAdd(newHoldingForm: HTMLElement): void {
    this.transactionService.collopsRow(newHoldingForm);
  }
}
