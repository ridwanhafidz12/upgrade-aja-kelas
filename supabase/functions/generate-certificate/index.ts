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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { courseId } = await req.json();

    if (!courseId) {
      throw new Error('Missing course ID');
    }

    // Check if enrollment is complete
    const { data: enrollment, error: enrollError } = await supabase
      .from('enrollments')
      .select('progress, completed_at')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (enrollError || !enrollment) {
      throw new Error('Enrollment not found');
    }

    if (enrollment.progress < 100) {
      throw new Error('Course not completed yet');
    }

    // Check if certificate already exists
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (existingCert) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          certificate: existingCert,
          message: 'Certificate already exists'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate certificate number
    const { data: certNumber } = await supabase.rpc('generate_certificate_number');

    // Get course and user details
    const { data: course } = await supabase
      .from('courses')
      .select('title')
      .eq('id', courseId)
      .single();

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    // Create verification URL - users will scan QR and go to this page
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('/v1', '').replace('https://', '').split('.')[0];
    const verificationUrl = `https://${baseUrl}.lovable.app/certificate/verify/${certNumber}`;
    
    // Generate QR code URL using a public QR code API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(verificationUrl)}`;

    // Create certificate record
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        course_id: courseId,
        certificate_number: certNumber,
        qr_code_url: qrCodeUrl
      })
      .select()
      .single();

    if (certError) {
      console.error('Certificate creation error:', certError);
      throw new Error('Failed to create certificate');
    }

    console.log('Certificate generated successfully:', {
      certificate_number: certNumber,
      user: profile?.full_name,
      course: course?.title,
      verification_url: verificationUrl
    });

    return new Response(
      JSON.stringify({
        success: true,
        certificate: {
          ...certificate,
          course_title: course?.title,
          user_name: profile?.full_name,
          verification_url: verificationUrl
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
