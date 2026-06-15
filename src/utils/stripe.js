import { httpsCallable } from "firebase/functions";
import { functions, FIREBASE_ENABLED } from "../lib/firebase";

/**
 * Redirects the user to a Stripe Checkout session for the given product.
 * productId must match a key in STRIPE_CATALOG (server-side).
 * Success/cancel URLs are set server-side — never passed from the client.
 * Throws "stripe_unavailable" in demo mode, or rethrows Cloud Function errors.
 */
export async function startCheckout(productId) {
  if (!FIREBASE_ENABLED || !functions) {
    throw new Error("stripe_unavailable");
  }

  const createSession = httpsCallable(functions, "createCheckoutSession");
  const { data } = await createSession({ productId });
  window.location.href = data.url;
}
