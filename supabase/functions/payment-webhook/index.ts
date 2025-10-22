import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const notification = await req.json();
    console.log('Received Midtrans notification:', notification);

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let paymentStatus = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        paymentStatus = 'settlement';
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'settlement';
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      paymentStatus = 'failed';
    }

    // Update payment status
    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({ status: paymentStatus })
      .eq('midtrans_order_id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating payment:', updateError);
      throw new Error('Failed to update payment');
    }

    // If payment is successful, create enrollment
    if (paymentStatus === 'settlement') {
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          user_id: payment.user_id,
          course_id: payment.course_id,
          progress: 0
        });

      if (enrollError && !enrollError.message.includes('duplicate')) {
        console.error('Error creating enrollment:', enrollError);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
