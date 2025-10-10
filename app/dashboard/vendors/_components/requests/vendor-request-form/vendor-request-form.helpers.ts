import type {
  VendorRequestFormValue,
  VendorRequestPayload,
} from "./vendor-request-form.schema";

export function mapVendorRequestFormToPayload(
  values: VendorRequestFormValue,
): VendorRequestPayload {
  const categories = values.categories
    ? values.categories
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : undefined;

  return {
    ...values,
    categories,
  };
}
