import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from "@/lib/email";
import { PLANS } from "@/lib/constants";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-02-24.acacia",
  });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, stripe);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("No userId in session metadata");
    return;
  }

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await updateSubscriptionInDB(userId, subscription, customerId);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const userSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!userSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  await updateSubscriptionInDB(userSubscription.userId, subscription, customerId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const userSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!userSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  // Downgrade to free plan
  await prisma.subscription.update({
    where: { userId: userSubscription.userId },
    data: {
      plan: SubscriptionPlan.FREE,
      status: SubscriptionStatus.CANCELED,
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
    },
  });

  console.log(`Subscription canceled for user ${userSubscription.userId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  const userSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
    include: { user: true },
  });

  if (!userSubscription) return;

  // Update subscription status to active
  await prisma.subscription.update({
    where: { userId: userSubscription.userId },
    data: {
      status: SubscriptionStatus.ACTIVE,
    },
  });

  // Send payment success email
  const plan = userSubscription.plan;
  const amount = PLANS[plan].price || 0;

  if (userSubscription.user.email) {
    sendPaymentSuccessEmail(
      userSubscription.user.email,
      userSubscription.user.name || "User",
      plan,
      amount
    ).catch((error) => {
      console.error("Failed to send payment success email:", error);
    });
  }

  console.log(`Payment succeeded for user ${userSubscription.userId}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const userSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
    include: { user: true },
  });

  if (!userSubscription) return;

  // Update subscription status to past due
  await prisma.subscription.update({
    where: { userId: userSubscription.userId },
    data: {
      status: SubscriptionStatus.PAST_DUE,
    },
  });

  // Send payment failed email
  if (userSubscription.user.email) {
    sendPaymentFailedEmail(
      userSubscription.user.email,
      userSubscription.user.name || "User",
      userSubscription.plan
    ).catch((error) => {
      console.error("Failed to send payment failed email:", error);
    });
  }

  console.log(`Payment failed for user ${userSubscription.userId}`);
}

async function updateSubscriptionInDB(
  userId: string,
  subscription: Stripe.Subscription,
  customerId: string
) {
  const priceId = subscription.items.data[0]?.price.id;
  const plan = getPlanFromPriceId(priceId);
  const status = mapStripeStatus(subscription.status);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId,
      plan,
      status,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`Subscription updated for user ${userId}: ${plan} - ${status}`);
}

function getPlanFromPriceId(priceId: string | undefined): SubscriptionPlan {
  if (!priceId) return SubscriptionPlan.FREE;

  // Map Stripe price IDs to subscription plans
  const proPriceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
  const enterprisePriceId = process.env.STRIPE_ENTERPRISE_PRICE_ID;

  if (priceId === proPriceId) return SubscriptionPlan.PRO;
  if (priceId === enterprisePriceId) return SubscriptionPlan.ENTERPRISE;

  return SubscriptionPlan.FREE;
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  const statusMap: Record<string, SubscriptionStatus> = {
    active: SubscriptionStatus.ACTIVE,
    canceled: SubscriptionStatus.CANCELED,
    incomplete: SubscriptionStatus.INCOMPLETE,
    incomplete_expired: SubscriptionStatus.CANCELED,
    past_due: SubscriptionStatus.PAST_DUE,
    trialing: SubscriptionStatus.TRIALING,
    unpaid: SubscriptionStatus.PAST_DUE,
  };

  return statusMap[status] || SubscriptionStatus.ACTIVE;
}
