import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  providerId: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Admin delete provider function called')
    
    // Get auth token from request headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin using secure RPC
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false }
    })
    
    const { data: isAdmin, error: adminCheckError } = await supabaseAdmin.rpc(
      'is_user_admin',
      { user_id: userData.user.id }
    )

    if (adminCheckError || !isAdmin) {
      console.error('Admin check failed:', adminCheckError)
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: RequestBody = await req.json()
    const { providerId } = body

    if (!providerId) {
      return new Response(
        JSON.stringify({ error: 'Provider ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get provider details including profile_id
    const { data: provider, error: fetchError } = await supabase
      .from('service_providers')
      .select('profile_id')
      .eq('id', providerId)
      .single()

    if (fetchError) {
      console.error('Fetch provider error:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Provider not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Delete the provider record first
    const { error: deleteProviderError } = await supabase
      .from('service_providers')
      .delete()
      .eq('id', providerId)

    if (deleteProviderError) {
      console.error('Delete provider error:', deleteProviderError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete provider' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If provider has an associated user account, delete it too
    if (provider.profile_id) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
      
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(provider.profile_id)
      
      if (deleteUserError) {
        console.error('Delete user error:', deleteUserError)
        // Don't fail the whole operation if user deletion fails
        // The provider record has already been deleted
        console.log('Provider deleted but user deletion failed')
      }
    }

    console.log('Provider deleted successfully:', providerId)
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})