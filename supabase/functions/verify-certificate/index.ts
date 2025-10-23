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

    const { certificateNumber } = await req.json();

    if (!certificateNumber) {
      throw new Error('Missing certificate number');
    }

    // Fetch certificate with related data
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select(`
        *,
        profiles!user_id (full_name),
        courses!course_id (title)
      `)
      .eq('certificate_number', certificateNumber)
      .maybeSingle();

    if (error) {
      console.error('Error fetching certificate:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        certificate: certificate,
        valid: !!certificate
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage, valid: false }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
