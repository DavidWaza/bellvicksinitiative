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
    </ul>
    <p>
      <strong>We do not take payments on this website</strong>, and we never ask for card or bank
      details through it. We do not use analytics or advertising cookies.
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

const address = `${SITE_INFO.address.street}, ${SITE_INFO.address.locality}, ${SITE_INFO.address.country}`;

usePageSeo({
  title: "Privacy policy — Bellvicks Initiative",
  description:
    "How Bellvicks Initiative collects, uses and protects the information you share through this website.",
});
</script>
