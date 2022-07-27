import { createPinia } from "pinia";
import useExpenses from "/@/store/expenses";

const pinia = createPinia();

pinia.use(({ store }) => {
  store.$subscribe((mutation, state) => {
    localStorage.setItem(mutation.storeId, JSON.stringify(state));
  });
});

export { pinia as default, useExpenses };
