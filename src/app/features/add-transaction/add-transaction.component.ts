import { Component, DestroyRef, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { type Holding } from '../../../models/holding.model';
import { type Summary } from '../../../models/summary.model';
import { type Transaction } from '../../../models/transaction.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css',
})
export class AddTransactionComponent {
  holding: Holding = {
    summary: {} as Summary,
    transaction: {} as Transaction,
  } as Holding;
  @Input() divHost!: HTMLElement;

  constructor(
    private transactionService: TransactionService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  onSave() {
    console.log(this.holding);
    const transactionSubscription = this.transactionService
      .createTransaction(this.holding)
      .subscribe({
        next: () => {
          //popup
        },
        error: (err) => {
          console.error('++++++++++++++\n', err);
        },
      });

    this.transactionService.collopsRow(this.divHost);

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
    });
  }
  onCancel() {
    this.transactionService.collopsRow(this.divHost);
  }
}
