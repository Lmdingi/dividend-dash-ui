import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { type Holding } from '../../../models/holding.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css',
})
export class TransactionDetailComponent implements OnInit {
  @Input() transaction!: Holding;
  holdingId: string = '';

  constructor(
    private transactionService: TransactionService,
    private destroyRef: DestroyRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const routeSubscription = this.route.queryParams.subscribe({
      next: (params) => {
        this.holdingId = params['id'];
      },
    });

    const transactionSubscription = this.transactionService
      .getTransactionById(this.holdingId)
      .subscribe({
        next: (response) => {
          // this.holding = response;
        },
      });

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
      routeSubscription.unsubscribe();
    });
  }
}
