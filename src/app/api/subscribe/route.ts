import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "VOS <sovereign@vosfragrance.com>",
      to: [email],
      subject: "Welcome to The Sovereign Circle",
      // This is the template you will see in your Gmail
      html: `
        <div style="background-color: #f5f2f0; padding: 60px 20px; font-family: 'Times New Roman', serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #d4b996; padding: 50px; text-align: center;">
            <h1 style="color: #5c4033; font-size: 32px; font-style: italic; font-weight: normal; margin-bottom: 5px;">VOS</h1>
            <p style="text-transform: uppercase; letter-spacing: 0.6em; font-size: 10px; color: #d4b996; margin-bottom: 40px; font-family: Arial, sans-serif;">Victorious Opulent Scents</p>

            <div style="width: 40px; h-height: 1px; background-color: #5c4033; margin: 0 auto 40px auto;"></div>

            <h2 style="color: #5c4033; font-size: 18px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 20px;">The Sovereign Circle</h2>

            <p style="color: #8c786a; font-size: 15px; line-height: 1.8; margin-bottom: 30px; font-family: Arial, sans-serif;">
              Your presence has been recognized. You are now part of an exclusive collective with early access to our scent architecture and limited edition Extraits.
            </p>

            <a href="https://vosfragrance.com/shop" style="background-color: #5c4033; color: #ffffff; padding: 15px 35px; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; font-weight: bold; font-family: Arial, sans-serif;">Explore the Collection</a>

            <p style="color: #d4b996; font-size: 10px; margin-top: 50px; text-transform: uppercase; letter-spacing: 0.2em; font-family: Arial, sans-serif;">Define Your Sovereign Presence</p>
            <p style="font-size: 10px; color: #8c786a; margin-top: 20px;">
              You are receiving this because you joined the Sovereign Circle at vosfragrance.com. 
              <br />
              If you wish to leave, you can <a href="#">unsubscribe</a> at any time.
            </p>
          </div>
          
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
