import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RUNWARE_API_KEY = Deno.env.get('RUNWARE_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!RUNWARE_API_KEY) {
      console.error('RUNWARE_API_KEY is not set');
      throw new Error('API key not configured');
    }

    console.log('Generating logo with Runware API');
    
    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          taskType: "authentication",
          apiKey: RUNWARE_API_KEY
        },
        {
          taskType: "imageInference",
          taskUUID: crypto.randomUUID(),
          positivePrompt: "professional logo design for 'Subhakaryam', featuring an elegant havan kund with sacred fire in maroon and gold colors, minimalist style, clean lines, modern typography, suitable for a Hindu ceremonies booking platform, high-end luxury feel, vector art style",
          model: "runware:100@1",
          width: 1024,
          height: 512,
          numberResults: 1,
          outputFormat: "WEBP",
          CFGScale: 1,
          scheduler: "FlowMatchEulerDiscreteScheduler",
          strength: 0.8
        }
      ])
    })

    const data = await response.json()
    console.log('Runware API response:', data);
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-logo function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})