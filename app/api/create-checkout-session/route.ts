import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

// Initialize Stripe (will throw an error at runtime if the secret key is missing, which is expected during setup)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia", // Adjust to a valid API version if needed, standard fallback is latest available in types
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // You need to set STRIPE_PRICE_ID in your .env variables
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      console.error("STRIPE_PRICE_ID is not configured.");
      return new NextResponse("Stripe configuration error", { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/social-share?success=true`,
      cancel_url: `${appUrl}/social-share?canceled=true`,
      client_reference_id: userId, // Pass Clerk userId so we can update them in the webhook
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
