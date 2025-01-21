import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pre-defined Q&A for common queries
const commonQuestions = {
  "hi": "Hello! Welcome to Subhakaryam. How can I assist you with our ceremonial services today?",
  "hello": "Hi there! Welcome to Subhakaryam. How can I help you with your ceremonial needs?",
  "services": "We offer various ceremonial services including Pooja services, Wedding ceremonies, Naming ceremonies, House warming ceremonies, and more. Which service would you like to know more about?",
  "booking": "You can book our services by selecting a service provider and choosing an available time slot. Would you like me to guide you through the booking process?",
  "contact": "You can reach us through our contact form or directly call our customer service. Would you like the contact details?",
  "prices": "Our service prices vary depending on the type of ceremony and the service provider. Would you like to know the price range for a specific service?",
  "locations": "We currently serve various cities and can arrange ceremonies at temples, homes, or venues of your choice. Which location are you interested in?",
  "about": "Subhakaryam is a platform connecting you with verified ceremonial service providers. We ensure authentic and traditional ceremonies with experienced professionals.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content.toLowerCase().trim();

    // Check for pre-defined answers first
    if (commonQuestions[userMessage]) {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: commonQuestions[userMessage],
                role: 'assistant'
              }
            }
          ]
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Sending request to OpenAI with messages:', messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for Subhakaryam, a platform for ceremonial services. 
            Focus on providing information about our services which include:
            - Pooja services
            - Wedding ceremonies
            - Naming ceremonies
            - House warming ceremonies
            - Other traditional Hindu ceremonies
            
            Keep responses brief, friendly, and focused on helping users understand and book our services.
            If users ask about topics unrelated to our services, politely redirect them to our ceremonial offerings.`
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    console.log('Received response from OpenAI:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat completion:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process your request. Please try again.',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});