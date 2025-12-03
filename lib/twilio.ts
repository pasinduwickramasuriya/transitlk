import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

// Simple SMS sender
export async function sendSMS(phoneNumber: string, message: string) {
  try {
    // Format phone: +94771234567
    const phone = phoneNumber.startsWith('+') ? phoneNumber : `+94${phoneNumber.replace(/^0/, '')}`
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    
    console.log(`✅ SMS sent to ${phone}`)
  } catch (error) {
    console.error('❌ SMS failed:', error)
  }
}
