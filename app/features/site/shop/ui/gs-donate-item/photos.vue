<template>
  <fieldset class="flex flex-col gap-2" :aria-describedby="error ? 'item-photos-error' : 'item-photos-hint'">
    <legend class="mb-1 text-sm font-bold text-base-900">Photos of the item</legend>
    <ul role="list" class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <li
        v-for="(p, i) in previews"
        :key="p.url"
        class="group relative aspect-square overflow-hidden rounded-2xl bg-base-100"
      >
        <img :src="p.url" :alt="`Photo ${i + 1} of the item`" class="size-full object-cover" />
        <span
          v-if="i === 0"
          class="absolute top-2 left-2 rounded-full bg-base-0/95 px-2 py-0.5 text-xs font-bold text-forest-900"
          >Main photo</span
        >
        <button
          type="button"
          class="absolute top-2 right-2 grid size-9 cursor-pointer place-items-center rounded-full bg-base-0/95 text-coral-700 shadow-soft"
          :aria-label="`Remove photo ${i + 1}`"
          @click="remove(i)"
        >
          <NIcon name="trash" />
        </button>
      </li>
      <li v-if="model.length < max">
        <label
          for="item-photos-input"
          :class="
            cn(
              'flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-3 text-center transition-colors hover:border-forest-500 hover:bg-forest-50',
              error ? 'border-red-600' : 'border-base-500',
            )
          "
        >
          <NIcon name="camera" weight="duotone" size="2rem" class="text-forest-500" />
          <span class="text-sm font-bold text-forest-900">
            {{ model.length ? "Add another" : "Add photos" }}
          </span>
          <span class="text-xs text-base-550">{{ model.length }} of {{ max }}</span>
        </label>
        <input
          id="item-photos-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="sr-only"
          :aria-invalid="Boolean(error) || undefined"
          @change="onPick"
        />
      </li>
    </ul>
    <p v-if="error" id="item-photos-error" role="alert" class="text-sm font-medium text-red-600">
      {{ error }}
    </p>
    <p v-else id="item-photos-hint" class="text-sm text-base-550">
      Up to {{ max }} clear photos in good light: the front, the back, any labels, and any marks.
      Phone photos are fine.
    </p>
  </fieldset>
</template>

<script setup lang="ts">
/** Up to `max` photos with previews; the first is the main photo. */
const props = withDefaults(defineProps<{ max?: number; error?: string }>(), {
  max: 4,
  error: undefined,
});
const model = defineModel<File[]>({ default: () => [] });

const previews = ref<{ url: string }[]>([]);
watch(
  model,
  (files) => {
    previews.value.forEach((p) => URL.revokeObjectURL(p.url));
    previews.value = files.map((f) => ({ url: URL.createObjectURL(f) }));
  },
  { deep: true },
);
onBeforeUnmount(() => previews.value.forEach((p) => URL.revokeObjectURL(p.url)));

function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  const picked = [...(input.files ?? [])].filter((f) => f.type.startsWith("image/"));
  model.value = [...model.value, ...picked].slice(0, props.max);
  input.value = "";
}
const remove = (i: number) => (model.value = model.value.filter((_, n) => n !== i));
</script>
