<template>
  <ul data-slot="avatar-stack" role="list" :class="cn('flex items-center -space-x-3', props.class)">
    <li
      v-for="(person, i) in people"
      :key="i"
      :class="
        cn(
          'relative flex size-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-base-50',
          TONE_CLASSES[person.tone].mid,
        )
      "
    >
      <NuxtImg
        v-if="person.src"
        :src="person.src"
        :alt="person.alt ?? ''"
        width="88"
        height="88"
        loading="lazy"
        class="size-full object-cover"
      />
      <!-- Neutral silhouette until real, consented portraits exist. -->
      <svg
        v-else
        viewBox="0 0 24 24"
        aria-hidden="true"
        :class="cn('size-7', TONE_CLASSES[person.tone].ink)"
      >
        <circle cx="12" cy="9" r="4" fill="currentColor" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7Z" fill="currentColor" />
      </svg>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { TONE_CLASSES, type Tone } from "~/utils/tones";

export interface AvatarPerson {
  tone: Tone;
  src?: string;
  alt?: string;
}

const props = defineProps<{ people: AvatarPerson[]; class?: HTMLAttributes["class"] }>();
</script>
