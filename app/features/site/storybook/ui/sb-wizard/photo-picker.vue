<template>
  <div class="flex flex-col gap-5">
    <!-- Guide + picker -->
    <div
      v-if="!photoUrl"
      class="flex flex-col items-center rounded-[2rem] border-2 border-dashed border-coral-150 bg-base-0 px-5 py-7"
    >
      <p class="font-bold text-base-900">What works best</p>
      <ul role="list" class="mt-4 grid grid-cols-3 gap-3 sm:gap-5">
        <li v-for="tip in TIPS" :key="tip.label" class="flex flex-col items-center gap-2">
          <span
            :class="
              cn(
                'relative flex size-20 items-center justify-center rounded-2xl sm:size-24',
                tip.good ? 'bg-mint-100 text-forest-500' : 'bg-base-100 text-base-500',
              )
            "
          >
            <NIcon :name="tip.icon" weight="duotone" size="3rem" :class="tip.iconClass" />
            <span
              :class="
                cn(
                  'absolute -bottom-2 flex size-7 items-center justify-center rounded-full ring-2 ring-base-0',
                  tip.good ? 'bg-forest-500 text-base-0' : 'bg-red-600 text-base-0',
                )
              "
            >
              <NIcon :name="tip.good ? 'check' : 'xCircle'" weight="fill" size="1.1rem" />
            </span>
          </span>
          <span class="mt-1 text-center text-sm text-base-600">{{ tip.label }}</span>
        </li>
      </ul>

      <label
        for="sb-photo"
        class="mt-7 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-forest-900 px-6 font-bold text-base-0 transition-colors hover:bg-forest-600 has-[:focus-visible]:shadow-[0_0_0_2px_var(--base-50),0_0_0_5px_var(--accent-600)]"
      >
        <NIcon name="upload" /> Choose photo
        <input
          id="sb-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          class="sr-only"
          aria-describedby="sb-photo-hint"
          @change="onFile"
        />
      </label>
      <p id="sb-photo-hint" class="mt-3 text-center text-sm text-base-550">
        JPG, PNG or WebP, up to 10&nbsp;MB.
      </p>
      <p v-if="error" role="alert" class="mt-2 text-sm font-medium text-red-600">{{ error }}</p>
    </div>

    <!-- Preview -->
    <div v-else class="relative mx-auto">
      <img
        :src="photoUrl"
        :alt="`Photo of ${name || 'your child'}`"
        class="max-h-96 w-auto max-w-full rounded-[2rem] object-contain shadow-soft"
      />
      <button
        type="button"
        aria-label="Remove photo"
        class="absolute -top-3 -right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-base-0 text-base-900 shadow-soft hover:bg-base-100"
        @click="clear"
      >
        <NIcon name="close" size="1.1rem" />
      </button>
    </div>

    <!-- Guardian consent (required: this is a child's photo) -->
    <label class="flex cursor-pointer items-start gap-3 rounded-2xl bg-base-0 p-4 shadow-soft">
      <input
        v-model="consent"
        type="checkbox"
        class="mt-0.5 size-5 shrink-0 cursor-pointer accent-coral-600"
      />
      <span class="text-sm text-base-600">
        <strong class="text-base-900">I'm {{ name || "this child" }}'s parent or guardian</strong>
        and I agree to this photo being used only to illustrate this book. It stays on this device
        until you place an order.
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { IconName } from "~/utils/icons";

/** Photo for the character. Held as an object URL in the browser; never uploaded in this version. */
defineProps<{ name: string }>();
const photoUrl = defineModel<string | null>("photoUrl", { required: true });
const consent = defineModel<boolean>("consent", { required: true });

const MAX_BYTES = 10 * 1024 * 1024;
const error = ref("");

const TIPS: { label: string; icon: IconName; good: boolean; iconClass?: string }[] = [
  { label: "Smiling, facing you", icon: "user", good: true },
  { label: "Facing away", icon: "user", good: false, iconClass: "opacity-50 -scale-x-100" },
  { label: "Group photo", icon: "community", good: false },
];

function onFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  error.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    error.value = "Please choose an image file.";
    return;
  }
  if (file.size > MAX_BYTES) {
    error.value = "That photo is over 10 MB. Please choose a smaller one.";
    return;
  }
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value);
  photoUrl.value = URL.createObjectURL(file);
}

function clear() {
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value);
  photoUrl.value = null;
  nextTick(() => document.getElementById("sb-photo")?.focus());
}
</script>
