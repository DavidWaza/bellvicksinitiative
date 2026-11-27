import type { ApiResponse } from "~/shared/api-response";
import { failResponse } from "~/shared/response-helpers";
import { SITE_INFO } from "~/shared/site-info";
import { shrinkPhotoForUpload } from "~/utils/downscale-image";
import type {
  ItemDonationReceived,
  ItemDonationServicePort,
} from "../../ports/item-donation.port";

/**
 * REAL (not a mock): posts a "Donate an item" offer and its photos to our server, which emails the
 * donations inbox (server/api/shop/donate-item.post.ts). Photos are shrunk in the browser first
 * (Vercel accepts at most 4.5 MB per request); a PDF receipt is sent as it is. Never throws.
 */
export default function useItemDonationHttpAdapter(): ItemDonationServicePort {
  const asUpload = async (file: Blob) =>
    file.type === "application/pdf" ? file : await shrinkPhotoForUpload(file, 1400);
  return {
    async submit({ data, photos, receipt, proof }) {
      const body = new FormData();
      body.append("data", JSON.stringify(data));
      for (const [i, photo] of photos.entries())
        body.append("photos", await shrinkPhotoForUpload(photo, 1400), `item-${i + 1}.jpg`);
      if (receipt)
        body.append("receipt", await asUpload(receipt), receipt.type === "application/pdf" ? "receipt.pdf" : "receipt.jpg");
      if (proof) body.append("proof", await asUpload(proof), proof.type === "application/pdf" ? "proof.pdf" : "proof.jpg");
      try {
        return await $fetch<ApiResponse<ItemDonationReceived>>("/api/shop/donate-item", {
          method: "POST",
          body,
          timeout: 60_000,
        });
      } catch {
        return failResponse(
          { received: true, reference: "" },
          `We couldn't send this just now. Please email us at ${SITE_INFO.email}.`,
        );
      }
    },
  };
}
