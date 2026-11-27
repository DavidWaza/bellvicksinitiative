<template>
  <lg-doc title="Terms of use">
    <h2>About these terms</h2>
    <p>
      These terms apply to your use of this website, run by {{ SITE_INFO.legalName }} ({{
        SITE_INFO.abbreviation
      }}). By using the site you agree to them.
    </p>

    <h2>Using this site</h2>
    <ul>
      <li>Please use the site lawfully and don't try to disrupt it or misuse its forms.</li>
      <li>Information you send us through a form should be accurate and yours to share.</li>
    </ul>

    <h2>Donations and pledges</h2>
    <p>
      Gifts in Naira can be paid on this website through Paystack's secure payment page. A monthly
      gift is charged to your card each month until you ask us to stop it: reply to your receipt
      email or contact us. Gifts in other currencies are pledges: we record your intention and
      contact you about how to complete it, and nothing is charged until you do. If you think a
      payment was taken in error, please contact us with your reference.
    </p>

    <h2>Content and photos</h2>
    <p>
      The text and design of this site belong to Bellvicks. Some photos are free stock images used
      under their own licences and are illustrative only; they don't show specific people we have
      supported. See our <NuxtLink :to="ROUTES.credits">photo credits</NuxtLink>.
    </p>

    <h2>Links to other sites</h2>
    <p>
      We link to other websites, such as our social media pages. We aren't responsible for their
      content.
    </p>

    <h2>Liability</h2>
    <p>
      We work to keep this site accurate and available, but we can't guarantee it will always be
      error-free or uninterrupted. Nothing in these terms limits any rights you have under the law.
    </p>

    <h2>Governing law</h2>
    <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>

    <h2>Contact</h2>
    <p>
      Questions about these terms? Email
      <a :href="`mailto:${SITE_INFO.email}`">{{ SITE_INFO.email }}</a> or write to us at
      {{ SITE_INFO.address.street }}, {{ SITE_INFO.address.locality }}.
    </p>
  </lg-doc>
</template>

<script setup lang="ts">
import { SITE_INFO } from "~/shared/site-info";
import { ROUTES } from "~/shared/site-routes";

usePageSeo({
  title: "Terms of use — Bellvicks Initiative",
  description: "The terms that apply to using the Bellvicks Initiative website.",
});
</script>
