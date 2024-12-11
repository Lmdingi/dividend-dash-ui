import { Component, DestroyRef, OnInit } from '@angular/core';
import { type Holding } from '../../../models/holding.model';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, TransactionDetailComponent],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnInit {
  holdings: Holding[] = [];
  currentVisible!: HTMLElement;
  isVisible: boolean = false;

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
    if (this.isVisible) {
      if (details.style.display === '') {        
        details.style.display = 'none';
        this.isVisible = false;
        return
      }
      this.currentVisible.style.display = 'none';
    }

    details.style.display = '';
    this.currentVisible = details;
    this.isVisible = true;
  }

  // onDetails(id: string): void {
  //   const transactionSubscription = this.transactionService
  //     .getTransactionById(id)
  //     .subscribe({
  //       next: (response) => {
  //         console.log(response);
  //       },
  //     });

  //   this.destroyRef.onDestroy(() => {
  //     transactionSubscription.unsubscribe();
  //   });
  // }

  // onDetails(id: string): void {
  //   this.router.navigate(['details'], {
  //     relativeTo: this.route,
  //     queryParams: { id: id },
  //     queryParamsHandling: 'merge',
  //   });
  // }
}
