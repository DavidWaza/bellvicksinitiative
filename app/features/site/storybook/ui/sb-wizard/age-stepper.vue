<template>
  <div>
    <label for="sb-age" class="mb-3 block font-bold text-base-900">Age</label>
    <div
      class="grid h-14 grid-cols-[1fr_1.6fr_1fr] overflow-hidden rounded-2xl border border-base-500"
    >
      <button
        type="button"
        aria-label="One year younger"
        aria-controls="sb-age"
        :disabled="model <= min"
        class="flex cursor-pointer items-center justify-center bg-base-50 text-base-900 transition-colors hover:bg-base-100 disabled:cursor-not-allowed disabled:text-base-400"
        @click="model = Math.max(min, model - 1)"
      >
        <NIcon name="minus" size="1.35rem" />
      </button>
      <input
        id="sb-age"
        v-model.number="model"
        type="number"
        inputmode="numeric"
        :min="min"
        :max="max"
        class="border-x border-base-500 bg-base-0 text-center text-lg font-bold text-base-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        @blur="model = clamp(model)"
      />
      <button
        type="button"
        aria-label="One year older"
        aria-controls="sb-age"
        :disabled="model >= max"
        class="flex cursor-pointer items-center justify-center bg-base-50 text-base-900 transition-colors hover:bg-base-100 disabled:cursor-not-allowed disabled:text-base-400"
        @click="model = Math.min(max, model + 1)"
      >
        <NIcon name="plus" size="1.35rem" />
      </button>
    </div>
    <p class="mt-2 text-sm text-base-550">Ages {{ min }} to {{ max }}.</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ min: number; max: number }>();
const model = defineModel<number>({ required: true });

const clamp = (v: number) =>
  Number.isFinite(v) ? Math.min(props.max, Math.max(props.min, Math.round(v))) : props.min;
</script>
