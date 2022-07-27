<script setup lang="ts">
import { DataRecord } from "/@/lib/data.js";

defineProps<{
  items: DataRecord[];
  title?: string;
}>();

defineEmits<{
  (e: "itemClick", payload: DataRecord): void;
}>();
</script>

<template>
  <section>
    <h1 v-if="title" :class="$style.listTitle">{{ title }}</h1>
    <ul :class="$style.list">
      <li v-for="item in items" :key="item.id" :class="$style.listItem">
        <a
          :class="$style.listItemContent"
          @click.prevent="$emit('itemClick', item)"
          data-fine-transition
          href="#"
        >
          <slot :item="item" />
        </a>
      </li>
    </ul>
  </section>
</template>

<style module scoped>
.listTitle {
  color: var(--c-fg-variant);
  font-size: var(--font-size-small);
  margin: 0 0 0.25rem;
  padding: 0 1rem;
  text-transform: uppercase;
}

.list {
  margin: 0;
  padding: 0;
}

.listItem {
  list-style-type: none;
  padding: 0.125rem 0;
}
.listItem + .listItem {
  border-top: var(--border-width) dashed var(--c-border);
  margin-top: 0;
}

.listItemContent {
  --link-color: var(--c-fg);
  align-items: center;
  border-radius: var(--border-radius);
  border: var(--border-width-large) solid transparent;
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  text-decoration: none;
}
.listItemContent:hover {
  border-color: var(--c-primary);
  color: var(--c-fg);
}
</style>
