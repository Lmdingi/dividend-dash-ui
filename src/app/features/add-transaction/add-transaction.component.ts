import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { type Holding } from '../../../models/holding.model';
import { type Summary } from '../../../models/summary.model';
import { type Transaction } from '../../../models/transaction.model';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';

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
  @Input() newHoldingForm!: HTMLElement;

  constructor(
    private transactionService: TransactionService,
    private dataService: DataService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  onSave() {
    const transactionSubscription = this.transactionService
      .createTransaction(this.holding)
      .subscribe({
        next: () => {
          //popup
          this.dataService.updateData();
        },
        error: (err) => {
          console.error(err);
        },
      });

    this.transactionService.collopsRow(this.newHoldingForm);

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
    });
  }

  onCancel() {
    this.transactionService.collopsRow(this.newHoldingForm);
    this.router.navigate([this.router.url]).then(() => {});
  }
}
