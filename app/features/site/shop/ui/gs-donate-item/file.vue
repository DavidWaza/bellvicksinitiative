<template>
  <div class="flex flex-col gap-1.5">
    <span :id="`${id}-label`" class="text-sm font-bold text-base-900">
      {{ label }}
      <span v-if="!required" class="font-normal text-base-550">(optional)</span>
    </span>
    <div
      :class="
        cn(
          'flex items-center gap-4 rounded-2xl border border-dashed bg-base-0 p-3',
          error ? 'border-red-600' : 'border-base-500',
        )
      "
    >
      <span
        class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-base-100 text-forest-500"
      >
        <img v-if="preview" :src="preview" alt="" class="size-full object-cover" />
        <NIcon v-else :name="model ? 'news' : 'upload'" weight="duotone" size="1.75rem" />
      </span>
      <div class="flex min-w-0 flex-1 flex-col items-start gap-1">
        <label
          :for="id"
          class="cursor-pointer rounded-full bg-forest-50 px-4 py-2 text-sm font-bold text-forest-900 transition-colors hover:bg-forest-100"
        >
          {{ model ? "Change file" : "Choose photo or PDF" }}
        </label>
        <input
          :id="id"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          class="sr-only"
          :aria-labelledby="`${id}-label`"
          :aria-describedby="error ? `${id}-error` : `${id}-hint`"
          :aria-invalid="Boolean(error) || undefined"
          @change="onPick"
        />
        <span v-if="model" class="max-w-full truncate text-xs text-base-550">{{ model.name }}</span>
        <button
          v-if="model"
          type="button"
          class="text-xs font-bold text-coral-700 underline underline-offset-2"
          @click="model = null"
        >
          Remove
        </button>
      </div>
    </div>
    <p v-if="error" :id="`${id}-error`" role="alert" class="text-sm font-medium text-red-600">
      {{ error }}
    </p>
    <p v-else :id="`${id}-hint`" class="text-sm text-base-550">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
/** One file: a photo or a PDF (receipt, proof of authenticity), with a small preview. */
withDefaults(
  defineProps<{ id: string; label: string; required?: boolean; error?: string; hint?: string }>(),
  { required: false, error: undefined, hint: "A photo (JPG, PNG, WebP) or a PDF, up to 2 MB." },
);
const model = defineModel<File | null>({ default: null });
const preview = ref<string | null>(null);

watch(model, (file) => {
  if (preview.value) URL.revokeObjectURL(preview.value);
  preview.value = file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
});
onBeforeUnmount(() => preview.value && URL.revokeObjectURL(preview.value));

function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) model.value = file;
  input.value = "";
}
</script>
