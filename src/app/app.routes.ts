import { Routes } from '@angular/router';
import { TransactionTableComponent } from './features/transaction-table/transaction-table.component';
import { EditTransactionComponent } from './features/edit-transaction/edit-transaction.component';


export const routes: Routes = [
  { path: '', component: TransactionTableComponent },
  {path: "edit", component: EditTransactionComponent }
];
