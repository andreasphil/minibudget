import { defineStore } from "pinia";
import { formatCurrency } from "/@/lib/currency";
import type { DataRecord } from "/@/lib/data";
import { newRecord, tryParse } from "/@/lib/data";

/* -------------------------------------------------- *
 * Expense-related types                              *
 * -------------------------------------------------- */

type ExpenseState = {
  expenses: Expense[];
  budget: number;
};

export type Expense = DataRecord & {
  name: string;
  amount: number;
  notes?: string;
};

export type ExpenseWritable = Omit<Expense, keyof DataRecord>;

export type ExpenseReport = Array<
  Expense & {
    formattedAmount: string;
  }
>;

type FormatterFn = (type: "budget" | "spent" | "remaining") => string;

/* -------------------------------------------------- *
 * Store                                              *
 * -------------------------------------------------- */

export default defineStore("expenses", {
  state(): ExpenseState {
    const state: Partial<ExpenseState> = tryParse("expenses") ?? {};
    const stateWithFallbacks: ExpenseState = {
      expenses: state.expenses ?? [],
      budget: state.budget ?? 0,
    };

    return stateWithFallbacks;
  },

  actions: {
    /** Adds an expense to the store. */
    newExpense(initial: ExpenseWritable) {
      const newExpense = newRecord<Expense>(initial);
      this.expenses.push(newExpense);
    },

    /** Updates an existing expense. Throws an error if the ID is not found. */
    updateExpense(id: Expense["id"], data: ExpenseWritable) {
      const index = this.expenses.findIndex((i) => i.id === id);
      if (index >= 0) {
        this.expenses[index] = {
          ...this.expenses[index],
          ...data,
          updatedAt: Date.now(),
        };
      } else {
        throw new Error("Expense not found");
      }
    },

    /** Deletes an existing expense. */
    deleteExpense(id: Expense["id"]) {
      const index = this.expenses.findIndex((i) => i.id === id);
      if (index >= 0) this.expenses.splice(index, 1);
    },
  },

  getters: {
    /** Calculates the sum of all expenses. */
    spent(): number {
      return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    },

    /** Calculates the remaining budget. */
    remaining(): number {
      return this.budget - this.spent;
    },

    /**
     * Returns a sorted list of expenses with the amounts formatted to be
     * displayed in the UI.
     */
    report(): ExpenseReport {
      return this.expenses
        .map((expense) => ({
          ...expense,
          formattedAmount: formatCurrency(expense.amount),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
    },

    /**
     * Returns various amounts calculated by the store formatted to be displayed
     * in the UI.
     */
    formatted(): FormatterFn {
      return (type: "budget" | "remaining" | "spent") =>
        formatCurrency(this[type]);
    },
  },
});
