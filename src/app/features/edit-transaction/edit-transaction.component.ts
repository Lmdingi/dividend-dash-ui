import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { type Holding } from '../../../models/holding.model';
import { type Summary } from '../../../models/summary.model';
import { type Transaction } from '../../../models/transaction.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css',
})
export class EditTransactionComponent implements OnInit, OnDestroy {
  holding: Holding = {
    summary: {} as Summary,
    transaction: {} as Transaction,
  } as Holding;
  holdingId?: string;
  isAlert = false;
  routeSubscription?: Subscription;
  transactionSubscription?: Subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.activeRoute.queryParams.subscribe({
      next: (params) => {
        this.holdingId = params['id'];
      },
    });

    if (this.holdingId) {
      this.transactionSubscription = this.transactionService
        .getTransactionById(this.holdingId)
        .subscribe({
          next: (response) => {
            this.holding = response;
          },
        });
    }
  }

  onSave() {
    if (!this.isAlert) {
      alert(
        "Your changes will be saved and cannot be undone. Click 'Save' again to confirm."
      );
      this.isAlert = true;
      return;
    }

    this.transactionSubscription = this.transactionService
      .updateTransaction(this.holding)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          // make popup
          console.error(err);
        },
      });
  }

  onCancel(): void {
    this.router.navigateByUrl('');
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    if (this.transactionSubscription) {
      this.transactionSubscription.unsubscribe();
    }
  }
}
