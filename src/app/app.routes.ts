import { Routes } from '@angular/router';
import { TransactionTableComponent } from './features/transaction-table/transaction-table.component';
import { EditTransactionComponent } from './features/edit-transaction/edit-transaction.component';
import { AddTransactionComponent } from './features/add-transaction/add-transaction.component';

export const routes: Routes = [
  { path: '', component: TransactionTableComponent },
  { path: 'edit', component: EditTransactionComponent },
  // { path: 'add', component: AddTransactionComponent },
];
