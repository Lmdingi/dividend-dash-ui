import { Component, DestroyRef, OnInit } from '@angular/core';
import { type Holding } from '../../../models/holding.model';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { DataService } from '../../../services/data.service';
import { Totals } from '../../../models/totals';

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
  totals: Totals = {} as Totals;
  isHoldingAdd: boolean = false;
  isAsc: boolean = true;

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

    const totalsSubscription = this.dataService.totalsData.subscribe(
      (updatedTotals) => {
        this.totals = updatedTotals;
      }
    );

    this.dataService.updateData();

    this.destroyRef.onDestroy(() => {
      dataSubscription.unsubscribe();
      totalsSubscription.unsubscribe();
    });
  }

  onDetails(details: HTMLElement): void {
    this.transactionService.collopsRow(details);
  }

  onAdd(newHoldingForm: HTMLElement): void {
    this.transactionService.collopsRow(newHoldingForm);
  }

  sort(sortBy: string) {
    const sortDirection = this.isAsc ? 'asc' : 'desc';
    this.dataService.updateData(sortBy, sortDirection);
    this.isAsc = !this.isAsc;
  }

  onAddingHolding(isAdded: boolean) {
    this.isHoldingAdd = isAdded;
  }
}
