import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.8'
import { createErrorResponse, validateRequiredParams, isValidUUID, ErrorCode } from '../_shared/errorHandler.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  userId: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Admin delete user function called')
    
    // Get auth token from request headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      const error = createErrorResponse(ErrorCode.UNAUTHORIZED);
      return new Response(
        JSON.stringify(error.response),
        { status: error.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create regular client to verify admin status
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    })

    // Verify the user is an admin
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      const error = createErrorResponse(ErrorCode.UNAUTHORIZED, userError);
      return new Response(
        JSON.stringify(error.response),
        { status: error.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userData.user.id)
      .single()

    if (profileError || profile?.user_type !== 'admin') {
      const error = createErrorResponse(ErrorCode.FORBIDDEN, profileError);
      return new Response(
        JSON.stringify(error.response),
        { status: error.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json()
    const { userId } = body

    // Validate userId parameter
    const validationError = validateRequiredParams({ userId }, ['userId']);
    if (validationError) {
      return new Response(
        JSON.stringify(validationError.response),
        { status: validationError.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate UUID format
    if (!isValidUUID(userId)) {
      const error = createErrorResponse(ErrorCode.INVALID_INPUT, `Invalid user ID format: ${userId}`);
      return new Response(
        JSON.stringify(error.response),
        { status: error.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client for user deletion
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Delete user from auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteError) {
      const error = createErrorResponse(ErrorCode.OPERATION_FAILED, deleteError);
      return new Response(
        JSON.stringify(error.response),
        { status: error.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User deleted successfully:', userId)
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const errorResponse = createErrorResponse(ErrorCode.INTERNAL_ERROR, error);
    return new Response(
      JSON.stringify(errorResponse.response),
      { status: errorResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})