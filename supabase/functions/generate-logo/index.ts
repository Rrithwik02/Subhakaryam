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
      console.error('RUNWARE_API_KEY is not set in Edge Function secrets');
      throw new Error('API key not configured. Please add RUNWARE_API_KEY to Edge Function secrets.');
    }

    console.log('Starting logo generation with Runware API');
    
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
          positivePrompt: "professional logo design for 'Subhakary', featuring an elegant havan kund with sacred fire in maroon and gold colors, minimalist style, clean lines, modern typography, suitable for a Hindu ceremonies booking platform, high-end luxury feel, vector art style",
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Runware API error response:', errorText);
      throw new Error(`Runware API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json()
    console.log('Runware API response:', data);
    
    // Check if data exists and has the expected structure
    if (!data || !Array.isArray(data)) {
      console.error('Unexpected Runware API response format (not an array):', data);
      throw new Error('Invalid response format from Runware API');
    }

    // Find the image inference result
    const imageResult = data.find(item => 
      item.taskType === "imageInference" && item.imageURL
    );

    if (!imageResult) {
      console.error('No valid image result found in response:', data);
      throw new Error('No valid image generated');
    }
    
    return new Response(
      JSON.stringify({ data: [imageResult] }),
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
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
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