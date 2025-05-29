import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
  console.error('Missing required EmailJS environment variables');
}

emailjs.init(EMAILJS_PUBLIC_KEY || '');

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  orderId: string,
  totalAmount: number,
  items: Array<{ name: string; quantity: number; price: number }>,
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
) => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const templateParams = {
        to_email: customerEmail,
        to_name: customerName,
        order_id: orderId,
        order_date: new Date().toLocaleDateString(),
        total_amount: totalAmount.toFixed(2),
        items: items.map(item => 
          `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n'),
        shipping_address: shippingAddress ? 
          `${shippingAddress.street}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}\n${shippingAddress.country}` : 
          'No shipping address provided',
        order_status: 'pending',
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID || '',
        EMAILJS_TEMPLATE_ID || '',
        templateParams
      );

      return {
        success: true,
        response,
        attempt
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      console.error(`Failed to send email (attempt ${attempt}/${MAX_RETRIES}):`, error);
      
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt); // Exponential backoff
      }
    }
  }

  throw new Error(`Failed to send email after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}; 