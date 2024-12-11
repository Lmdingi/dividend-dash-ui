import { Routes } from '@angular/router';
import { TransactionTableComponent } from './features/transaction-table/transaction-table.component';
import { TransactionDetailComponent } from './features/transaction-detail/transaction-detail.component';

export const routes: Routes = [
  { path: '', component: TransactionTableComponent },
  // {path: "details", component: TransactionDetailComponent }
];
