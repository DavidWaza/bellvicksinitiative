<template>
  <NSection tone="cream" labelledby="testimonials-title" class="cv-auto pt-4 md:pt-8">
    <NContainer>
      <div class="text-center">
        <NEyebrow v-reveal>What people say</NEyebrow>
        <NHeading id="testimonials-title" v-reveal="1" class="mt-4 text-forest-900">
          Stories of
          <NHeadingHighlight tone="accent">hope</NHeadingHighlight>
        </NHeading>
      </div>

      <NCarousel v-reveal="2" label="Testimonials" class="mt-10">
        <NCarouselContent class="-ml-4 gap-0 py-3">
          <NCarouselItem
            v-for="item in testimonials"
            :key="item.id"
            class="pl-4 md:basis-1/2 lg:basis-1/3"
          >
            <NCard class="h-full p-6">
              <figure class="flex h-full flex-col gap-5">
                <blockquote class="text-base-600">
                  <NTodo :content="item.quote" label="Testimonial" class="w-full">
                    “{{ item.quote }}”
                    <template #placeholder>A real, permitted testimonial.</template>
                  </NTodo>
                </blockquote>
                <figcaption class="mt-auto flex items-center gap-3">
                  <NAvatarStack :people="[{ tone: 'lavender' }]" />
                  <div class="text-sm">
                    <p class="font-bold text-base-900">
                      <NTodo :content="item.name" label="Name">
                        {{ item.name }}
                        <template #placeholder>Name</template>
                      </NTodo>
                    </p>
                    <p class="mt-1 text-base-550">
                      <NTodo :content="item.role" label="Role">
                        {{ item.role }}
                        <template #placeholder>Role</template>
                      </NTodo>
                    </p>
                  </div>
                </figcaption>
              </figure>
            </NCard>
          </NCarouselItem>
        </NCarouselContent>
        <NCarouselControls class="mt-6" />
      </NCarousel>
    </NContainer>
  </NSection>
</template>

<script setup lang="ts">
import type { HomeTestimonial } from "../../domain/home-types";

defineProps<{ testimonials: HomeTestimonial[] }>();
</script>
