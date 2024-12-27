import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { type Holding } from '../../../models/holding.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css',
})
export class TransactionDetailComponent {
  @Input() transaction: Holding = {} as Holding;
  private listLastPage: number = 0;

  constructor(
    private transactionService: TransactionService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  onEdit(id?: string): void {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      queryParams: { id: id },
      queryParamsHandling: 'merge',
    });
  }

  onDelete(): void {
    let listSubscription: Subscription;
    const deleteSubscription = this.transactionService
      .deleteTransactionById(this.transaction.id)
      .subscribe({
        next: () => {
          listSubscription = this.dataService.listCount.subscribe(
            (updatedList) => {
              this.listLastPage = updatedList.length;
            }
          );

          this.dataService.updateData(
            undefined,
            undefined,
            this.listLastPage,
            undefined
          );
        },
        error: (err) => {
          console.error(err);
        },
      });

    this.destroyRef.onDestroy(() => {
      deleteSubscription.unsubscribe();
      listSubscription.unsubscribe();
    });
  }
}
