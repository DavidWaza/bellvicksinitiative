<template>
  <div class="grid gap-4">
    <blockquote
      class="rounded-2xl border-l-4 border-forest-500 bg-forest-50 p-5 font-medium text-forest-900 italic"
    >
      <p v-for="(para, i) in statement" :key="i" :class="i > 0 && 'mt-3'">{{ para }}</p>
    </blockquote>

    <label
      :class="
        cn(
          'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:checked]:border-forest-500 has-[:checked]:bg-forest-50',
          agreeError ? 'border-red-600' : 'border-base-150',
        )
      "
    >
      <input
        v-model="agreed"
        type="checkbox"
        class="mt-0.5 size-5 shrink-0 cursor-pointer accent-forest-500"
        :aria-invalid="Boolean(agreeError) || undefined"
      />
      <span class="text-sm font-bold text-base-900">{{ agreeLabel }}</span>
    </label>
    <p v-if="agreeError" role="alert" class="-mt-2 text-sm font-medium text-red-600">
      {{ agreeError }}
    </p>

    <div class="grid gap-5 sm:grid-cols-[1fr_auto]">
      <NField
        v-slot="f"
        :label="signatureLabel"
        hint="Type your full name. This is your signature."
        :error="signatureError"
      >
        <NInput
          :id="f.id"
          v-model="signature"
          autocomplete="name"
          class="font-hand text-2xl"
          :aria-describedby="f.describedby"
          :invalid="f.invalid"
        />
      </NField>
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-bold text-base-900">Date</span>
        <span
          class="flex h-12 items-center rounded-xl border border-base-150 bg-base-50 px-4 text-base-600"
          >{{ date || "Today" }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_TIME_ZONE } from "~/utils/time-zone";

/**
 * A declaration from the paper form, its tick box, a typed signature and today's date (Lagos).
 * The server stamps the date again when it sends the application.
 */
withDefaults(
  defineProps<{
    statement: string[];
    agreeLabel: string;
    agreeError?: string;
    signatureLabel?: string;
    signatureError?: string;
  }>(),
  { agreeError: undefined, signatureLabel: "Signature", signatureError: undefined },
);
const agreed = defineModel<boolean>("agreed", { default: false });
const signature = defineModel<string>("signature", { default: "" });

// Set after mount: the page is prerendered, so the build date must never show.
const date = ref("");
onMounted(() => {
  date.value = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeZone: APP_TIME_ZONE,
  }).format(new Date());
});
</script>
