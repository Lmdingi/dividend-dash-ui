import { Summary } from "./summary.model";
import { Transaction } from "./transaction.model";

export interface Holding {
  id: string;
  name: string;
  symbol: string;
  transaction: Transaction;
  summary: Summary;
}
