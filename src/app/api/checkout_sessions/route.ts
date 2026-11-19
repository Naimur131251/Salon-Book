import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL!;
const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL!;

export async function POST(req: Request) {
  try {
    // 1. Get logged-in user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 },
      );
    }

    if (session.user.role !== "customer") {
      return NextResponse.json(
        { success: false, message: "Only customers can make payments" },
        { status: 403 },
      );
    }

    // Better Auth session token
    const token = session.session.token;

    // 2. Get appointment ID
    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 },
      );
    }

    // 3. Get customer's appointments from Express backend
    const appointmentsRes = await fetch(`${API_URL}/customer/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!appointmentsRes.ok) {
      throw new Error("Failed to fetch appointments");
    }

    const appointments = await appointmentsRes.json();

    const appointmentList = Array.isArray(appointments)
      ? appointments
      : appointments.appointments || [];

    const appointment = appointmentList.find(
      (item: { _id: string }) => item._id === appointmentId,
    );

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 },
      );
    }

    // 4. Validate appointment
    if (appointment.status !== "confirmed") {
      return NextResponse.json(
        {
          success: false,
          message: "Only confirmed appointments can be paid",
        },
        { status: 400 },
      );
    }

    if (appointment.paymentStatus === "paid") {
      return NextResponse.json(
        {
          success: false,
          message: "This appointment is already paid",
        },
        { status: 400 },
      );
    }

    const amount = Number(appointment.servicePrice);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid appointment amount" },
        { status: 400 },
      );
    }

    // 5. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      // payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: (process.env.STRIPE_CURRENCY || "usd").toLowerCase(),
            product_data: {
              name: "Salon Appointment",
              description: `Appointment date: ${appointment.appointmentDate}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      customer_email: session.user.email,

      client_reference_id: appointmentId,

      metadata: {
        appointmentId,
        customerId: session.user.id,
      },

      success_url: `${CLIENT_URL}/customer/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/payment/cancel?appointment_id=${appointmentId}`,
    });

    // 6. Save Checkout Session ID in the appointment
    const saveSessionRes = await fetch(
      `${API_URL}/customer/appointments/${appointmentId}/checkout-session`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkoutSessionId: checkoutSession.id,
        }),
      },
    );

    if (!saveSessionRes.ok) {
      await stripe.checkout.sessions.expire(checkoutSession.id);

      return NextResponse.json(
        {
          success: false,
          message: "Could not prepare appointment payment",
        },
        { status: 409 },
      );
    }

    // 7. Return Checkout URL
    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Checkout session error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
