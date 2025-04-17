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
    const { phone, email, password } = req.body;

    if (!phone || !email || !password) {
      return res.status(400).json({
        message: 'Phone, email, and password are required',
      });
    }

    // Send WhatsApp message
    await twilioClient.messages.create({
      body: `Your FarmBox guest account has been created!\nEmail: ${email}\nPassword: ${password}\nPlease save these credentials to track your orders.`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
    });

    return res.status(200).json({
      message: 'WhatsApp confirmation sent successfully',
    });
  } catch (error) {
    console.error('WhatsApp error:', error);
    return res.status(500).json({
      message: 'Failed to send WhatsApp confirmation',
      error: error.message,
    });
  }
}