import sql from '../farmboxes/db';
import bcrypt from 'bcryptjs';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    // Format phone number to E.164 (Pakistan-specific)
    const formattedPhone = phone.startsWith('+') ? phone : `+92${phone.slice(1)}`;

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes expiry

    // Send OTP via WhatsApp
    try {
      await twilioClient.messages.create({
        body: `Your OTP for FarmBox verification is: ${otp}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${formattedPhone}`,
      });
    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      // Check for specific Twilio verification error (e.g., number not verified)
      if (twilioError.code === 60203 || twilioError.message.includes('not verified')) {
        return res.status(400).json({ message: 'Number not verified in Twilio' });
      }
      return res.status(500).json({ message: 'Failed to send OTP' });
    }

    // Store OTP in database temporarily
    await sql`
      INSERT INTO otp_verifications (
        phone,
        otp,
        expiry
      ) VALUES (
        ${formattedPhone},
        ${otp},
        ${otpExpiry}
      ) ON CONFLICT (phone) DO UPDATE
      SET otp = ${otp}, expiry = ${otpExpiry}
    `;

    return res.status(200).json({
      message: 'OTP sent successfully',
      phone: formattedPhone,
    });
  } catch (error) {
    console.error('OTP generation error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}