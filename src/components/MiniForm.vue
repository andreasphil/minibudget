<script setup lang="ts">
import { onMounted, ref } from "vue";

const emit = defineEmits<{
  (e: "submit", payload: Event): void;
  (e: "validityChange", payload: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    /** Automatically focus the first item in the form on mount */
    autofocus?: boolean;
  }>(),
  { autofocus: true }
);

const formEl = ref<HTMLFormElement>();
const wasValid = ref(false);

onMounted(() => {
  // Auto focus the first input element in the form if one exists
  if (props.autofocus) formEl.value?.querySelector("input")?.focus();

  // Check validity and store the initial value + update the parent
  wasValid.value = formEl.value?.checkValidity() ?? false;
  emit("validityChange", wasValid.value);
});

/** Emit current validity on every input, but only if it has changed. */
function checkValidity(e: Event) {
  const isValid = (e.target as HTMLFormElement)?.checkValidity() ?? false;
  if (isValid !== wasValid.value) {
    wasValid.value = isValid;
    emit("validityChange", isValid);
  }
}
</script>

<template>
  <form
    ref="formEl"
    @input="checkValidity"
    @submit.stop.prevent="emit('submit', $event)"
  >
    <slot />
  </form>
</template>

<style module scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
