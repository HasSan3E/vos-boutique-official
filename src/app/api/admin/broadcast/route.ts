import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js"; // Import createClient
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Create a PRIVATE admin client that ignores RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  // Add 'req: Request' here
  try {
    // 1. ADD THIS LINE: This extracts the product info sent from your Admin Dashboard
    const { product } = await req.json();

    // Now 'product' exists, so the rest of your code will work!
    const { data: subscribers, error: dbError } = await supabaseAdmin
      .from("subscribers")
      .select("email");

    if (dbError) throw dbError;

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers found in DB" },
        { status: 400 },
      );
    }

    // ... rest of your Resend code remains the same

    const emailList = subscribers.map((s) => s.email);

    // 2. Send the Broadcast via Resend
    // Note: Resend "To" field handles arrays, but for large lists (>50),
    // it's better to use 'bcc' or a loop. For now, this is the clean way:
    const { data, error: emailError } = await resend.emails.send({
      from: "VOS <sovereign@vosfragrance.com>",
      to: emailList,
      subject: `New Masterpiece: ${product.name} is Live`,
      html: `
        <div style="background-color: #faf9f6; padding: 40px; font-family: serif; color: #5c4033; text-align: center;">
          <h2 style="font-style: italic;">The Sovereign Circle</h2>
          <hr style="width: 50px; border-top: 1px solid #d4b996; margin: 20px auto;" />
          <p style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 10px;">New Arrival</p>
          <img src="${product.image_url}" style="width: 100%; max-width: 300px; margin: 20px 0; border: 1px solid #d4b996;" />
          <h1 style="font-weight: normal; margin: 10px 0;">${product.name}</h1>
          <p style="font-size: 18px; color: #8c786a;">Rs. ${product.price.toLocaleString()}</p>
          <p style="max-width: 400px; margin: 20px auto; line-height: 1.6; font-size: 14px;">
            A new chapter in scent architecture has been published. Secure your bottle from the limited first batch.
          </p>
          <a href="https://vosfragrance.com/products/${product.id}" style="display: inline-block; background: #5c4033; color: white; padding: 15px 30px; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 20px;">Explore Scent</a>
        </div>
      `,
    });

    if (emailError)
      return NextResponse.json({ error: emailError }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
