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
  totalsDisplay: string = 'd-flex';
  pageNumber = 1;
  pageSize = 4;
  list: number[] = [];
  private listLastPage: number = 0;

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

    const listSubscription = this.dataService.listCount.subscribe(
      (updatedList) => {
        this.list = updatedList;
      }
    );

    this.dataService.updateData(
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );

    this.destroyRef.onDestroy(() => {
      dataSubscription.unsubscribe();
      totalsSubscription.unsubscribe();
      listSubscription.unsubscribe()
    });
  }

  onDetails(details: HTMLElement): void {
    this.transactionService.collopsRow(details);
  }

  onAdd(newHoldingForm: HTMLElement): void {
    this.totalsDisplay = 'd-none';
    this.transactionService.collopsRow(newHoldingForm);
  }

  sort(sortBy: string) {
    const sortDirection = this.isAsc ? 'asc' : 'desc';

    const listSubscription = this.dataService.listCount.subscribe(
      (updatedList) => {
        this.listLastPage = updatedList.length;
      }
    );

    this.dataService.updateData(sortBy, sortDirection, this.listLastPage,undefined);
    this.isAsc = !this.isAsc;

    this.destroyRef.onDestroy(() => {
      listSubscription.unsubscribe()
    });
  }

  onAddingHolding(isAdded: boolean) {
    this.isHoldingAdd = isAdded;
  }

  toggleTotalsDisplay(display: string) {
    this.totalsDisplay = display;
  }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;

    this.dataService.updateData(
      undefined,
      undefined,
      pageNumber,
      this.pageSize
    );
  }

  getPrevPage() {
    if (this.pageNumber - 1 > 0) {
      this.pageNumber--;

      this.dataService.updateData(
        undefined,
        undefined,
        this.pageNumber,
        this.pageSize
      );
    }
  }

  getNextPage() {
    if (this.pageNumber + 1 <= this.list.length) {
      this.pageNumber++;

      this.dataService.updateData(
        undefined,
        undefined,
        this.pageNumber,
        this.pageSize
      );
    }
  }
}
