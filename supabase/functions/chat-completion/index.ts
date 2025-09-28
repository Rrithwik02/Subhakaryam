import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pre-defined Q&A for common queries about our services
const commonQuestions = {
  "hi": "Hello! Welcome to Subhakary. How can I assist you with our ceremonial services today?",
  "hello": "Hi there! Welcome to Subhakary. How can I help you with your ceremonial needs?",
  "poojari services": "Our poojari services include experienced priests who can perform various religious ceremonies including pujas, homams, and other traditional rituals. Would you like to know about specific ceremonies or booking process?",
  "booking": "To book a poojari service: \n1. Browse available priests\n2. Select your preferred date and time\n3. Make advance payment to confirm\n4. Receive confirmation\n\nWould you like me to help you start the booking process?",
  "catering": "Our catering services specialize in traditional prasadam and ceremonial food preparations. We offer:\n- Customized menu planning\n- Pure vegetarian options\n- Traditional prasadam items\n- Special dietary accommodations\n\nWould you like to know more about our catering packages?",
  "services": "We offer various ceremonial services including:\n1. Pooja Services\n2. Wedding Ceremonies\n3. Naming Ceremonies\n4. House Warming\n5. Catering Services\n6. Traditional Music\n7. Decoration Services\n\nWhich service would you like to know more about?",
  "contact": "You can reach us through:\n- Phone: Available in your profile\n- Email: admin@subhakary.com\n- Chat: Right here!\n\nOur customer service team is available 7 days a week.",
  "prices": "Our service prices vary based on:\n- Type of ceremony\n- Duration\n- Additional requirements\n\nPooja services typically start from ₹2,000. Would you like a detailed quote for a specific service?",
  "locations": "We currently serve in various cities including:\n- Hyderabad\n- Bangalore\n- Chennai\n- Mumbai\n\nWe can arrange ceremonies at temples, homes, or venues of your choice.",
  "about": "Subhakary is your trusted platform for authentic ceremonial services. We connect you with verified priests, caterers, and other service providers to ensure traditional ceremonies are performed with utmost devotion and authenticity.",
  "i need to book poojari services": "I'll help you book a poojari service. To get started, I'll need to know:\n1. What type of puja do you need?\n2. When do you need the service?\n3. What's your preferred location?\n\nPlease provide these details, and I'll guide you through the booking process.",
  "give information about poojari services": "Our poojari services include:\n1. Daily Pujas\n2. Graha Shanti\n3. Satyanarayana Swamy Vratham\n4. Griha Pravesam\n5. Naming Ceremony\n6. Wedding Ceremony\n7. Special Festival Pujas\n\nAll our priests are well-versed in traditional rituals and ceremonies. Would you like specific information about any of these services?"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content.toLowerCase().trim();

    // Check for pre-defined answers first
    for (const [key, value] of Object.entries(commonQuestions)) {
      if (userMessage.includes(key)) {
        return new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: value,
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
    }

    // If no pre-defined answer found, use OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for Subhakary, a platform for ceremonial services. 
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
    console.log('Received response:', data);

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
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});