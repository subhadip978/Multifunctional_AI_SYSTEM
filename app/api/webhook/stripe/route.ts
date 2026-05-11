import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed.", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    if (event.type === "checkout.session.completed") {
      const userId = session.client_reference_id;
      if (!userId) {
        console.error("No userId found in session client_reference_id.");
        return new NextResponse("User ID missing", { status: 400 });
      }

      // Update Clerk User's public metadata to mark them as PRO
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          tier: "PRO",
          stripeSubscriptionId: session.subscription as string,
          stripeCustomerId: session.customer as string,
        },
      });

      console.log(`User ${userId} upgraded to PRO.`);
    }

    // You can handle subscription cancellations here too
    // if (event.type === "customer.subscription.deleted") { ... set tier: "FREE" }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook handler error", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
