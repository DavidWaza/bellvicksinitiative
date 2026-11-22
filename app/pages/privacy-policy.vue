<template>
  <lg-doc title="Privacy policy">
    <h2>Who we are</h2>
    <p>
      This website is run by {{ SITE_INFO.legalName }} ({{ SITE_INFO.abbreviation }}),
      {{ address }}. We are responsible for the personal information you share with us through this
      site. You can reach us at <a :href="`mailto:${SITE_INFO.email}`">{{ SITE_INFO.email }}</a>.
    </p>

    <h2>What we collect</h2>
    <p>We only collect the information you choose to give us through our forms:</p>
    <ul>
      <li><strong>Newsletter:</strong> your email address.</li>
      <li>
        <strong>Volunteer, mentor and partner forms:</strong> your name, email, phone number
        (optional) and the details you write.
      </li>
      <li><strong>Contact form:</strong> your name, email, topic and message.</li>
      <li>
        <strong>Donation pledges:</strong> your name, email, the cause, amount, currency and
        frequency you choose.
      </li>
      <li>
        <strong>Storybook orders:</strong> your name, email, phone and delivery address, and the
        details of each book (the child's first name, age, the answers you gave, the "from" name and
        dedication).
      </li>
    </ul>
    <p>
      <strong>Storybook payments are handled by Paystack.</strong> You pay on Paystack's secure
      page; we never see or store your card or bank details. Paystack also receives your order
      details so we can process and deliver it. Donations are pledges only: we don't take donation
      payments on this website. Your cart is kept in your own browser until you check out. We do not
      use analytics or advertising cookies.
    </p>

    <h2>Why we use it</h2>
    <ul>
      <li>To reply to you and follow up on your enquiry, application or pledge.</li>
      <li>To send our newsletter, if you've subscribed. You can unsubscribe at any time.</li>
      <li>
        To run our programmes safely, including safeguarding checks for anyone who works with
        children.
      </li>
    </ul>
    <p>
      We process your information with your consent, or where we have a legitimate interest in
      responding to you, in line with the Nigeria Data Protection Act 2023.
    </p>

    <h2>Who we share it with</h2>
    <p>
      We never sell your information. We share it only with service providers who help us run this
      website and send email, and only as far as they need to, or where the law requires it.
    </p>

    <h2>How long we keep it</h2>
    <p>
      We keep your information only as long as we need it for the purpose you gave it for, then
      delete it. Newsletter subscribers stay on our list until they unsubscribe.
    </p>

    <h2>Children and photos</h2>
    <p>
      We only publish photos or stories of children with their parent's or guardian's consent. Some
      photos on this site are illustrative stock images; see our
      <NuxtLink :to="ROUTES.credits">photo credits</NuxtLink>.
    </p>

    <h2>Storybook photos</h2>
    <p v-if="hasServer">
      When you create a storybook, a parent or guardian must agree before a child's photo is used.
      Your answers and the photo are emailed to the Bellvicks storybook team, only so we can
      illustrate and print that child's books.
      <template v-if="aiCovers">
        The photo is also sent securely to our illustration service, OpenAI, to draw the book
        covers.
      </template>
      We don't publish the photo or use it for anything else, and you can ask us to delete it at any
      time.
    </p>
    <p v-else>
      When you create a storybook, a parent or guardian must agree before a child's photo is used.
      The photo stays on your own device while you preview your books; we only receive it if you
      place an order, and use it only to illustrate those books.
    </p>

    <h2>Your rights</h2>
    <p>
      You can ask to see, correct or delete the information we hold about you, or withdraw your
      consent, by emailing <a :href="`mailto:${SITE_INFO.email}`">{{ SITE_INFO.email }}</a>. If
      you're unhappy with how we've handled your information, you can also contact the Nigeria Data
      Protection Commission.
    </p>

    <h2>Changes</h2>
    <p>If we change this policy, we'll update the date at the top of this page.</p>
  </lg-doc>
</template>

<script setup lang="ts">
import { SITE_INFO } from "~/shared/site-info";
import { ROUTES } from "~/shared/site-routes";

const aiCovers = useAiCovers();
const hasServer = !useRuntimeConfig().public.staticSite;

const address = `${SITE_INFO.address.street}, ${SITE_INFO.address.locality}, ${SITE_INFO.address.country}`;

usePageSeo({
  title: "Privacy policy — Bellvicks Initiative",
  description:
    "How Bellvicks Initiative collects, uses and protects the information you share through this website.",
});
</script>
