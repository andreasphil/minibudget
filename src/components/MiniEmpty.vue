<template>
  <div :class="$style.emptyState" data-fine-transition>
    <slot />
  </div>
</template>

<style module>
.emptyState {
  align-items: center;
  border-radius: var(--border-radius);
  border: var(--border-width-large) dashed var(--c-border);
  color: var(--c-fg-variant);
  display: flex;
  flex-direction: column;
  margin: var(--block-spacing-y) 0;
  padding: 2.5rem 1.5rem;
}
</style>
