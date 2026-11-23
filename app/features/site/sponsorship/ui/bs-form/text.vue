<template>
  <NField v-slot="f" :label="label" :optional="optional" :hint="hint" :error="errorMessage">
    <NInput
      :id="f.id"
      v-model="value"
      :type="type"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :aria-describedby="f.describedby"
      :invalid="f.invalid"
      @blur="handleBlur"
    />
  </NField>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";

/** A labelled text input bound by `name` to the surrounding vee-validate form. */
const props = withDefaults(
  defineProps<{
    name: string;
    label: string;
    optional?: boolean;
    hint?: string;
    type?: "text" | "tel" | "email" | "number";
    autocomplete?: string;
    inputmode?: "text" | "tel" | "email" | "numeric";
  }>(),
  {
    optional: false,
    hint: undefined,
    type: "text",
    autocomplete: "off",
    inputmode: undefined,
  },
);
const { value, errorMessage, handleBlur } = useField<string>(() => props.name);
</script>
