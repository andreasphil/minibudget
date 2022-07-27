<script setup lang="ts">
import { reactive } from "vue";
import MiniDialog from "/@/components/MiniDialog.vue";
import MiniEmpty from "/@/components/MiniEmpty.vue";
import MiniForm from "/@/components/MiniForm.vue";
import MiniList from "/@/components/MiniList.vue";
import GitHubIcon from "/@/icons/GitHub.vue";
import meta from "/@/lib/metadata";
import { useExpenses } from "/@/store";
import { type Expense, type ExpenseWritable } from "/@/store/expenses";

const expensesStore = useExpenses();

function resetExpenses() {
  expensesStore.expenses = [];
}

/* -------------------------------------------------- *
 * Expense dialog                                     *
 * -------------------------------------------------- */

type ExpenseDialogData = ExpenseWritable & {
  id: string;
  isVisible: boolean;
  isValid: boolean;
  title: string;
};

function newExpenseDialogData(): ExpenseDialogData {
  return {
    id: "",
    isVisible: false,
    isValid: false,
    title: "Add expense",
    amount: 0,
    name: "",
    notes: "",
  };
}

const expenseDialog = reactive(newExpenseDialogData());

function resetExpenseDialog(): void {
  Object.assign(expenseDialog, newExpenseDialogData());
}

function showEditExpense(expense?: Expense): void {
  resetExpenseDialog();

  if (expense) {
    Object.assign(expenseDialog, expense, {
      title: `Edit “${expense.name}”`,
    });
  }

  expenseDialog.isVisible = true;
}

function saveExpense(): void {
  if (!expenseDialog.isValid) return;

  const payload: ExpenseWritable = {
    amount: expenseDialog.amount,
    name: expenseDialog.name,
    notes: expenseDialog.notes,
  };

  if (expenseDialog.id) expensesStore.updateExpense(expenseDialog.id, payload);
  else expensesStore.newExpense(payload);

  expenseDialog.isVisible = false;
}

function deleteExpense(): void {
  expensesStore.deleteExpense(expenseDialog.id);
  expenseDialog.isVisible = false;
}

/* -------------------------------------------------- *
 * Budget dialog                                      *
 * -------------------------------------------------- */

type BudgetDialogData = {
  isVisible: boolean;
  isValid: boolean;
  budget: number;
};

function newBudgetDialogData(): BudgetDialogData {
  return {
    isVisible: false,
    isValid: false,
    budget: expensesStore.budget,
  };
}

const budgetDialog = reactive(newBudgetDialogData());

function resetBudgetDialog(): void {
  Object.assign(budgetDialog, newBudgetDialogData());
}

function showEditBudget(): void {
  resetBudgetDialog();
  budgetDialog.isVisible = true;
}

function saveBudget(): void {
  if (!budgetDialog.isValid) return;

  expensesStore.budget = budgetDialog.budget;
  budgetDialog.isVisible = false;
}
</script>

<template>
  <div data-fine-container>
    <header>
      <nav>
        <small :class="$style.navTitle">Minibudget</small>
        <a role="button" data-fine-button="ghost" @click="resetExpenses()">
          Reset
        </a>
      </nav>
    </header>

    <main>
      <!-- Budget summary -->
      <article :class="$style.summary">
        <figure :class="$style.summaryItem">
          <span :class="$style.summaryItemBalance">{{
            expensesStore.formatted("spent")
          }}</span>
          <figcaption :class="$style.summaryItemName">Spent</figcaption>
        </figure>

        <figure
          :class="[
            $style.summaryItem,
            { [$style.summaryItemOverspent]: expensesStore.remaining < 0 },
          ]"
        >
          <span :class="$style.summaryItemBalance">{{
            expensesStore.formatted("remaining")
          }}</span>
          <figcaption :class="$style.summaryItemName">Remaining</figcaption>
        </figure>

        <figure
          :class="[$style.summaryItem, $style.budgetItem]"
          @click="showEditBudget()"
          data-fine-button="ghost"
          role="button"
        >
          <span :class="$style.summaryItemBalance">{{
            expensesStore.formatted("budget")
          }}</span>
          <figcaption :class="$style.summaryItemName" data-fine-transition>
            Budget
          </figcaption>
        </figure>
      </article>

      <!-- Current expenses -->
      <section>
        <div :class="$style.expensesActions">
          <button type="button" @click="showEditExpense()">Add expense</button>
        </div>

        <MiniList
          v-if="expensesStore.report?.length > 0"
          v-slot="{ item }"
          :items="expensesStore.report"
          @item-click="showEditExpense($event)"
        >
          <span>{{ item.name }}</span>
          <strong :class="$style.expenseItemAmount">{{
            item.formattedAmount
          }}</strong>
        </MiniList>

        <MiniEmpty v-else>
          You haven&rsquo;t added any expenses yet.
        </MiniEmpty>
      </section>
    </main>

    <!-- Footer -->
    <footer data-fine-container :class="$style.footer">
      <small>
        A thing made by <a :href="meta.authorWebsite">{{ meta.author }}.</a>
      </small>

      <a :href="meta.repository" title="Source code on GitHub">
        <GitHubIcon />
      </a>
    </footer>

    <div id="dialogOutlet"></div>
  </div>

  <!-- Expense adding / editing dialog -->
  <MiniDialog
    v-model="expenseDialog.isVisible"
    :can-confirm="expenseDialog.isValid"
    :title="expenseDialog.title"
    @cancel="expenseDialog.isVisible = false"
    form-id="expenseForm"
  >
    <MiniForm
      @submit="saveExpense()"
      @validity-change="expenseDialog.isValid = $event"
      id="expenseForm"
    >
      <label>
        Name
        <input
          v-model.trim="expenseDialog.name"
          autofocus
          placeholder="e.g. Groceries"
          required
          type="text"
        />
      </label>
      <label>
        Amount
        <input
          v-model="expenseDialog.amount"
          placeholder="0"
          required
          type="number"
        />
      </label>
      <label>
        Notes
        <textarea
          v-model="expenseDialog.notes"
          data-fine-textarea="no-resize"
        />
      </label>
    </MiniForm>

    <template #footer="scope">
      <button
        v-if="expenseDialog.id"
        :class="$style.expenseDeleteButton"
        @click="deleteExpense()"
        data-fine-button="outline"
        type="button"
      >
        Delete
      </button>
      <button
        @click="scope.onCancel()"
        data-fine-button="outline"
        type="button"
      >
        {{ scope.cancelButtonLabel }}
      </button>
      <button
        :disabled="!scope.canConfirm"
        :form="scope.formId"
        @click="scope.onConfirm()"
        type="submit"
      >
        {{ scope.confirmButtonLabel }}
      </button>
    </template>
  </MiniDialog>

  <!-- Budget editing dialog -->
  <MiniDialog
    v-model="budgetDialog.isVisible"
    :can-confirm="budgetDialog.isValid"
    @cancel="budgetDialog.isVisible = false"
    form-id="budgetForm"
    title="Edit budget"
  >
    <MiniForm
      @submit="saveBudget()"
      @validity-change="budgetDialog.isValid = $event"
      id="budgetForm"
    >
      <label>
        Budget
        <input
          v-model="budgetDialog.budget"
          placeholder="0"
          required
          type="number"
        />
      </label>
    </MiniForm>
  </MiniDialog>
</template>

<style module scoped>
.navTitle {
  color: var(--c-fg-variant);
  font-weight: bold;
}

/* -------------------------------------------------- *
 * Summary                                            *
 * -------------------------------------------------- */

.summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summaryItem {
  flex: 1 1 0;
  margin: 0;
  padding: 1.5rem;
  text-align: center;
}
.summaryItem + .summaryItem {
  border: 0px dashed var(--c-border);
  border-width: var(--border-width) 0 0 0;
}
.summaryItemOverspent {
  color: var(--c-danger);
}

.summaryItemName {
  color: var(--c-fg-variant);
  display: block;
  font-size: var(--font-size-small);
  font-weight: bold;
  text-transform: uppercase;
}

.summaryItemBalance {
  font-size: var(--font-size-h2);
  font-weight: bold;
}

@media (min-width: 800px) {
  .summary {
    flex-direction: row;
  }
  .summaryItem + .summaryItem {
    border-width: 0 0 0 var(--border-width);
  }
}

.budgetItem {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
.budgetItem:hover .summaryItemName {
  color: inherit;
}

/* -------------------------------------------------- *
 * Expenses                                           *
 * -------------------------------------------------- */

.expensesActions {
  display: flex;
  gap: 0.5rem;
  margin: var(--block-spacing-y) 0 calc(var(--block-spacing-y) - 1rem);
}

.expenseItem {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.expenseItemAmount {
  margin-left: auto;
}

.expenseDeleteButton {
  color: var(--c-danger);
}

/* -------------------------------------------------- *
 * Footer                                             *
 * -------------------------------------------------- */

.footer {
  align-items: center;
  color: var(--c-fg-variant);
  display: flex;
  justify-content: space-between;
  margin: 5rem 0 calc(5rem - var(--body-padding-y));
}
</style>
