<template>
  <div class="flex flex-col gap-1.5">
    <span :id="`${inputId}-label`" class="text-sm font-bold text-base-900">
      {{ label }}
      <span v-if="!required" class="font-normal text-base-550">(optional)</span>
    </span>
    <div
      :class="
        cn(
          'flex items-center gap-4 rounded-2xl border border-dashed p-3',
          error ? 'border-red-600' : 'border-base-500',
        )
      "
    >
      <span
        class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-base-100 text-base-550"
      >
        <img v-if="preview" :src="preview" alt="" class="size-full object-cover" />
        <NIcon v-else :name="icon" weight="duotone" size="1.75rem" />
      </span>
      <div class="flex min-w-0 flex-1 flex-col items-start gap-1">
        <label
          :for="inputId"
          class="cursor-pointer rounded-full bg-forest-50 px-4 py-2 text-sm font-bold text-forest-900 transition-colors hover:bg-forest-100"
        >
          {{ model ? "Change photo" : "Choose photo" }}
        </label>
        <input
          :id="inputId"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="sr-only"
          :aria-labelledby="`${inputId}-label`"
          :aria-describedby="error ? `${inputId}-error` : `${inputId}-hint`"
          :aria-invalid="Boolean(error) || undefined"
          @change="onPick"
        />
        <span v-if="fileName" class="max-w-full truncate text-xs text-base-550">{{
          fileName
        }}</span>
        <button
          v-if="model"
          type="button"
          class="text-xs font-bold text-coral-700 underline underline-offset-2"
          @click="clear"
        >
          Remove
        </button>
      </div>
    </div>
    <p v-if="error" :id="`${inputId}-error`" role="alert" class="text-sm font-medium text-red-600">
      {{ error }}
    </p>
    <p v-else :id="`${inputId}-hint`" class="text-sm text-base-550">
      {{ hint ?? "A clear photo (JPG, PNG or WebP). Photos taken on a phone are fine." }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { IconName } from "~/utils/icons";

/** A photo upload (passport photograph or a photo of a document) with a small preview. */
withDefaults(
  defineProps<{
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    icon?: IconName;
  }>(),
  { required: false, error: undefined, hint: undefined, icon: "camera" },
);
const model = defineModel<File | null>({ default: null });

const inputId = useId();
const preview = ref<string | null>(null);
const fileName = computed(() => model.value?.name ?? "");

watch(model, (file) => {
  if (preview.value) URL.revokeObjectURL(preview.value);
  preview.value = file ? URL.createObjectURL(file) : null;
});
onBeforeUnmount(() => preview.value && URL.revokeObjectURL(preview.value));

function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) model.value = file;
  input.value = "";
}
function clear() {
  model.value = null;
}
</script>
