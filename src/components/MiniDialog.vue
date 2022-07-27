<script setup lang="ts">
import { reactive, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** Title of the dialog */
    title?: string;
    /** Label displayed on the confirm button */
    confirmButtonLabel?: string;
    /** Label displayed on the cancel button */
    cancelButtonLabel?: string;
    /** Enables the confirm button (default is enabled) */
    canConfirm?: boolean;
    /** If set, the confirm button is attached to the form with that ID */
    formId?: string;
    /** Controls the visibility of the dialog */
    modelValue: boolean;
    /** Size preset: small, normal or large */
    size?: "small" | "normal" | "large";
  }>(),
  {
    confirmButtonLabel: "Confirm",
    cancelButtonLabel: "Cancel",
    canConfirm: true,
    size: "normal",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", visible: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

function onConfirm() {
  emit("confirm");
}

function onCancel() {
  emit("cancel");
}

/**
 * Returns an object containing various properties and helpers that will be
 * injected into the various slots available in the dialog. This allows custom
 * slot contents to still use some of the functionality and context of the
 * dialog.
 */
function getSlotScope() {
  return {
    onConfirm,
    onCancel,
    confirmButtonLabel: props.confirmButtonLabel,
    cancelButtonLabel: props.cancelButtonLabel,
    canConfirm: props.canConfirm,
    formId: props.formId,
  };
}

const slotScope = reactive(getSlotScope());

watch(
  () => props,
  () => Object.assign(slotScope, getSlotScope()),
  { deep: true }
);
</script>

<template>
  <Teleport to="#dialogOutlet">
    <Transition name="dialog">
      <div v-if="modelValue" :class="$style.backdrop">
        <section :class="[$style.dialog, $style[size]]">
          <header
            v-if="$slots.header || title"
            :class="$style.dialogChrome"
            data-fine-trim="both"
          >
            <slot name="header">
              <h1 :class="$style.dialogTitle">{{ title }}</h1>
            </slot>
          </header>
          <main :class="$style.dialogBody">
            <slot v-bind="slotScope" />
          </main>
          <footer :class="[$style.dialogChrome, $style.dialogFooterButtons]">
            <slot v-bind="slotScope" name="footer">
              <button
                @click="onCancel()"
                data-fine-button="outline"
                type="button"
              >
                {{ cancelButtonLabel }}
              </button>
              <button
                :disabled="!canConfirm"
                :form="formId"
                :type="formId ? 'submit' : 'button'"
                @click="onConfirm()"
              >
                {{ confirmButtonLabel }}
              </button>
            </slot>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style module scoped>
.backdrop {
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  background: var(--c-backdrop-bg);
  bottom: 0;
  left: 0;
  padding: clamp(16px, 10.467vw + -22.729px, 128px);
  position: fixed;
  right: 0;
  top: 0;
}

.dialog {
  background: var(--c-surface-bg);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-elevation-high);
  color: var(--c-surface-fg);
  margin: 0 auto;
  max-width: 100%;
}

.dialog.small {
  width: 20rem;
}

.dialog.normal {
  width: 30rem;
}

.dialog.large {
  width: 40rem;
}

.dialogChrome {
  padding: 2rem;
}

.dialogBody {
  padding: 0 2rem;
}

.dialogTitle {
  font-size: var(--font-size-h3);
}

.dialogFooterButtons {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
}
</style>

<style scoped>
.dialog-leave-active,
.dialog-enter-active {
  transition-duration: calc(var(--transition-duration) * 0.5);
  transition-property: opacity, transform;
  transition-timing-function: var(--transition-timing-function);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: translateY(-1.5rem) scale(0.9);
}
</style>
