import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Holding } from '../../../models/holding.model';
import { TransactionService } from '../../../services/transaction.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css',
})
export class EditTransactionComponent implements OnInit {
  holding!: Holding;
  holdingId!: string;
  isAlert = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const routeSubscription = this.activeRoute.queryParams.subscribe({
      next: (params) => {
        this.holdingId = params['id'];
      },
    });

    const transactionSubscription = this.transactionService
      .getTransactionById(this.holdingId)
      .subscribe({
        next: (response) => {
          this.holding = response;
        },
      });

    this.destroyRef.onDestroy(() => {
      transactionSubscription.unsubscribe();
      routeSubscription.unsubscribe();
    });
  }

  onSave() {
    if (!this.isAlert) {
      alert(
        "Your changes will be saved and cannot be undone. Click 'Save' again to confirm."
      );
      this.isAlert = true;
      return;
    }

    console.log('saved changes');

    this.router.navigateByUrl('');
  }

  onCancel(): void {
    this.router.navigateByUrl('');
  }
}
