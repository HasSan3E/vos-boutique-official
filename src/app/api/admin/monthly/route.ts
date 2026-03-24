import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize the Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST() {
  try {
    // 1. Fetch products for the digest
    const { data: featuredProducts, error: prodError } = await supabaseAdmin
      .from("products")
      .select("*") // Fixed typo here
      .limit(3);

    if (prodError) throw prodError;

    // 2. Fetch all subscribers
    const { data: subscribers, error: subError } = await supabaseAdmin
      .from("subscribers")
      .select("email"); // Ensure this is correct too

    if (subError) throw subError;

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers found." },
        { status: 400 },
      );
    }

    const emailList = subscribers.map((s) => s.email);

    // 3. Send the Email via Resend
    const { data, error: emailError } = await resend.emails.send({
      from: "VOS <sovereign@vosfragrance.com>",
      to: emailList,
      subject: "The Monthly Edit | VOS Scent Architecture",
      html: `
        <div style="background-color: #faf9f6; padding: 50px; font-family: serif; color: #5c4033; text-align: center;">
          <h1 style="font-style: italic; font-weight: normal; font-size: 32px;">VOS</h1>
          <p style="text-transform: uppercase; letter-spacing: 0.5em; font-size: 10px; margin-bottom: 40px;">The Monthly Edit</p>
          <p style="font-size: 14px; line-height: 1.8; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto;">
            A curation of our finest scent architectures. Defined by opulence, crafted for the sovereign.
          </p>
          ${featuredProducts
            ?.map(
              (p) => `
            <div style="margin-bottom: 40px; border-bottom: 1px solid #d4b996; padding-bottom: 20px;">
              <img src="${p.image_url}" style="width: 200px; height: 200px; object-fit: cover; border: 1px solid #d4b996;" />
              <h3 style="margin: 15px 0 5px 0; font-weight: normal;">${p.name}</h3>
              <p style="font-size: 12px; color: #8c786a; margin-bottom: 15px;">Rs. ${p.price.toLocaleString()}</p>
              <a href="https://vosfragrance.com/products/${p.slug}" style="background: #5c4033; color: white; padding: 10px 20px; text-decoration: none; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">View Extrait</a>
            </div>
          `,
            )
            .join("")}
          <p style="font-size: 10px; color: #d4b996; margin-top: 50px; text-transform: uppercase; letter-spacing: 0.3em;">Victorious Opulent Scents</p>
        </div>
      `,
    });

    if (emailError) throw emailError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Monthly Digest Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
