import Stripe from "stripe";
import { prisma as db } from "./db";
import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  // Get or create Stripe customer
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let customerId = user.subscription?.stripeCustomerId;

  // Create new customer if doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: user.id,
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  return session;
}

/**
 * Create a Stripe customer portal session
 */
export async function createCustomerPortalSession(
  userId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription?.stripeCustomerId) {
    throw new Error("No Stripe customer found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Handle successful checkout
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    throw new Error("No userId in session metadata");
  }

  // Get subscription details from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Determine plan based on price ID
  const priceId = stripeSubscription.items.data[0]?.price.id;
  let plan: SubscriptionPlan = "FREE";

  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) {
    plan = "PRO";
  } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    plan = "ENTERPRISE";
  }

  // Update or create subscription
  await db.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      status: stripeSubscription.status.toUpperCase() as SubscriptionStatus,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
    update: {
      plan,
      status: stripeSubscription.status.toUpperCase() as SubscriptionStatus,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
  });
}

/**
 * Handle subscription updated
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = subscription.customer as string;

  // Find user by customer ID
  const existingSubscription = await db.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!existingSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  // Determine plan based on price ID
  const priceId = subscription.items.data[0]?.price.id;
  let plan: SubscriptionPlan = "FREE";

  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) {
    plan = "PRO";
  } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    plan = "ENTERPRISE";
  }

  // Update subscription
  await db.subscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      plan,
      status: subscription.status.toUpperCase() as SubscriptionStatus,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

/**
 * Handle subscription deleted/canceled
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = subscription.customer as string;

  // Find and downgrade to FREE plan
  await db.subscription.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      plan: "FREE",
      status: "CANCELED",
      stripeSubscriptionId: null,
      stripePriceId: null,
      cancelAtPeriodEnd: false,
    },
  });
}

/**
 * Handle successful payment
 */
export async function handlePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  // Update subscription status
  await db.subscription.updateMany({
    where: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  // TODO: Send payment success email
  // await sendPaymentSuccessEmail(customerId);
}

/**
 * Handle failed payment
 */
export async function handlePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  // Update subscription status
  await db.subscription.updateMany({
    where: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
    data: {
      status: "PAST_DUE",
    },
  });

  // TODO: Send payment failed email
  // await sendPaymentFailedEmail(customerId);
}

/**
 * Get subscription status for a user
 */
export async function getSubscriptionStatus(userId: string) {
  const subscription = await db.subscription.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return subscription;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) return false;

  return (
    subscription.status === "ACTIVE" || subscription.status === "TRIALING"
  );
}

/**
 * Get user's current plan
 */
export async function getUserPlan(userId: string): Promise<SubscriptionPlan> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
    select: { plan: true },
  });

  return subscription?.plan || "FREE";
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(userId: string): Promise<void> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new Error("No active subscription found");
  }

  // Update in Stripe
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  // Update in database
  await db.subscription.update({
    where: { userId },
    data: {
      cancelAtPeriodEnd: true,
    },
  });
}

/**
 * Reactivate canceled subscription
 */
export async function reactivateSubscription(userId: string): Promise<void> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new Error("No subscription found");
  }

  // Update in Stripe
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  // Update in database
  await db.subscription.update({
    where: { userId },
    data: {
      cancelAtPeriodEnd: false,
    },
  });
}
