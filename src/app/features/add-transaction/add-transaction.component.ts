import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  errorMessages: string[] = [];
  @Output() isSuccessfullyAdd = new EventEmitter<boolean>();
  @Output() totalsDisplay = new EventEmitter<string>();
  private isAdded: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private dataService: DataService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    this.errorMessages = [];
    const transactionSubscription = this.transactionService
      .createTransaction(this.holding)
      .subscribe({
        next: () => {
          this.isAdded = true;
          this.totalsDisplay.emit('d-flex');
          this.isSuccessfullyAdd.emit(this.isAdded);
          setTimeout(() => {
            this.isAdded = false;
            this.isSuccessfullyAdd.emit(this.isAdded);
          }, 3000);

          this.dataService.updateData();
          form.reset();
          this.transactionService.collopsRow(this.newHoldingForm);
        },
        error: (err) => {
          for (const errors in err.error.errors) {
            for (const errorMessage of err.error.errors[errors]) {
              this.errorMessages.push(errorMessage);
            }
          }
        },
      });

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
    });
  }

  onCancel(form: NgForm) {
    this.errorMessages = [];
    this.isAdded = false;
    this.totalsDisplay.emit('d-flex');
    this.isSuccessfullyAdd.emit(this.isAdded);
    form.reset();
    this.transactionService.collopsRow(this.newHoldingForm);
  }
}
