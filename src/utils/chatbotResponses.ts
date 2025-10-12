export interface ChatResponse {
  message: string;
  quickReplies?: string[];
}

export const serviceResponses: Record<string, ChatResponse> = {
  poojari: {
    message: `🕉️ **Poojari Services**\n\nOur experienced poojaris offer authentic religious ceremonies:\n\n• Wedding ceremonies\n• Housewarming (Griha Pravesh)\n• Naming ceremonies (Namakarana)\n• Thread ceremonies (Upanayana)\n• Festival pujas (Diwali, Navaratri, etc.)\n• Personal prayers and consultations\n• Homams and Yagnas\n\n💰 **Pricing**: Starting from ₹2,000\n\nAll our poojaris are well-versed in Vedic traditions and rituals.`,
    quickReplies: ['Book Poojari', 'View Availability', 'Contact Us']
  },
  
  mehendi: {
    message: `💅 **Mehendi & Makeup Services**\n\nProfessional beauty services for your special occasions:\n\n• Bridal mehendi (intricate designs)\n• Party & festival mehendi\n• Arabic & traditional styles\n• Bridal makeup\n• Party makeup\n• Hairstyling\n\n💰 **Pricing**: Mehendi from ₹500, Makeup from ₹3,000\n\nOur artists use premium quality products and create stunning designs.`,
    quickReplies: ['Book Artist', 'View Portfolio', 'Check Prices']
  },
  
  photography: {
    message: `📸 **Photography & Videography**\n\nCapture your precious moments professionally:\n\n• Wedding photography & videography\n• Birthday & anniversary shoots\n• Corporate events\n• Product photography\n• Pre-wedding shoots\n• Candid photography\n• Drone videography\n\n💰 **Pricing**: Starting from ₹15,000 for events\n\nHigh-quality output with professional editing included.`,
    quickReplies: ['Book Photographer', 'View Samples', 'Custom Package']
  },
  
  catering: {
    message: `🍽️ **Catering Services**\n\nDelicious traditional & modern cuisine:\n\n• Wedding catering\n• Birthday party catering\n• Corporate events\n• Festival celebrations\n• Pure vegetarian options\n• Traditional prasadam\n• Customized menus\n\n💰 **Pricing**: Starting from ₹200 per plate\n\nFresh ingredients, hygienic preparation, and authentic taste guaranteed.`,
    quickReplies: ['Book Caterer', 'Menu Options', 'Get Quote']
  },
  
  music: {
    message: `🎵 **Mangala Vayudhyam (Music Services)**\n\nTraditional ceremonial music:\n\n• Nadaswaram for weddings\n• Tavil accompaniment\n• Temple ceremonies\n• Religious functions\n• Cultural events\n• Auspicious occasions\n\n💰 **Pricing**: Starting from ₹8,000\n\nAuthentic traditional music performed by experienced artists.`,
    quickReplies: ['Book Musicians', 'Hear Samples', 'Event Details']
  },
  
  decoration: {
    message: `🎨 **Decoration Services**\n\nBeautiful décor for every occasion:\n\n• Wedding decoration\n• Birthday party themes\n• Corporate events\n• Festival decorations\n• Stage setup\n• Flower arrangements\n• Lighting & draping\n\n💰 **Pricing**: Starting from ₹10,000\n\nCreative designs tailored to your theme and budget.`,
    quickReplies: ['Book Decorator', 'View Themes', 'Request Quote']
  },
  
  functionHall: {
    message: `🏛️ **Function Hall Services**\n\nPerfect venues for your events:\n\n• Wedding halls\n• Birthday party venues\n• Corporate meeting spaces\n• Reception halls\n• Seating capacity: 50-1000+\n• AC & non-AC options\n• Catering facilities available\n\n💰 **Pricing**: Starting from ₹15,000 per day\n\nWell-maintained venues with modern amenities.`,
    quickReplies: ['View Halls', 'Check Availability', 'Book Tour']
  }
};

export const generalResponses: Record<string, ChatResponse> = {
  greeting: {
    message: `🙏 Namaste! Welcome to **Subhakary**!\n\nI'm here to help you with our ceremonial and event services. You can ask me about:\n\n• Poojari services\n• Mehendi & makeup\n• Photography\n• Catering\n• Music (Mangala Vayudhyam)\n• Decoration\n• Function halls\n• Booking process\n• Pricing & packages`,
    quickReplies: ['View All Services', 'How to Book', 'Service Areas']
  },
  
  booking: {
    message: `📅 **How to Book**\n\n1️⃣ Browse available service providers\n2️⃣ Select your preferred date and service\n3️⃣ Review pricing and details\n4️⃣ Make advance payment to confirm\n5️⃣ Receive booking confirmation\n6️⃣ Service provider contacts you\n\n✅ Secure payment process\n✅ Instant confirmation\n✅ Easy cancellation policy`,
    quickReplies: ['Browse Services', 'Contact Support', 'Payment Info']
  },
  
  pricing: {
    message: `💰 **Pricing Information**\n\nOur prices vary based on:\n• Type of service\n• Event duration\n• Customization requirements\n• Location\n\n**General Price Range:**\n• Poojari: ₹2,000+\n• Mehendi: ₹500+\n• Photography: ₹15,000+\n• Catering: ₹200/plate\n• Music: ₹8,000+\n• Decoration: ₹10,000+\n• Function Hall: ₹15,000/day\n\nContact us for detailed quotes!`,
    quickReplies: ['Get Custom Quote', 'View Services', 'Book Now']
  },
  
  locations: {
    message: `📍 **Service Areas**\n\nWe currently serve in:\n• Hyderabad\n• Bangalore\n• Chennai\n• Mumbai\n• Pune\n• Delhi NCR\n\nWe can arrange services at:\n✓ Temples\n✓ Your home\n✓ Function halls\n✓ Outdoor venues\n✓ Custom locations\n\nTravel charges may apply for distant locations.`,
    quickReplies: ['Check My Area', 'View All Cities', 'Book Service']
  },
  
  contact: {
    message: `📞 **Contact Us**\n\n**Customer Support**\n• Phone: Available in your profile\n• Email: support@subhakary.com\n• WhatsApp: Quick response\n\n**Hours**\n• Monday-Sunday: 7 AM - 10 PM\n• Quick response time\n• Multilingual support\n\nWe're here to help!`,
    quickReplies: ['Call Now', 'Send Email', 'WhatsApp']
  },
  
  about: {
    message: `🌟 **About Subhakary**\n\nYour trusted platform for authentic ceremonial services!\n\n✓ Verified service providers\n✓ Transparent pricing\n✓ Secure payments\n✓ Quality assurance\n✓ Easy booking process\n✓ Customer support\n\nWe connect you with experienced professionals to make your ceremonies memorable and authentic.`,
    quickReplies: ['View Services', 'How It Works', 'Book Now']
  }
};

// Pattern matching for user queries
export const detectIntent = (input: string): string | null => {
  const lowercaseInput = input.toLowerCase();
  
  // Service-specific patterns
  if (lowercaseInput.includes('poojari') || lowercaseInput.includes('priest') || 
      lowercaseInput.includes('puja') || lowercaseInput.includes('pooja')) {
    return 'poojari';
  }
  
  if (lowercaseInput.includes('mehendi') || lowercaseInput.includes('mehndi') || 
      lowercaseInput.includes('henna') || lowercaseInput.includes('makeup') || 
      lowercaseInput.includes('beauty')) {
    return 'mehendi';
  }
  
  if (lowercaseInput.includes('photo') || lowercaseInput.includes('video') || 
      lowercaseInput.includes('camera') || lowercaseInput.includes('shoot')) {
    return 'photography';
  }
  
  if (lowercaseInput.includes('cater') || lowercaseInput.includes('food') || 
      lowercaseInput.includes('menu') || lowercaseInput.includes('prasad')) {
    return 'catering';
  }
  
  if (lowercaseInput.includes('music') || lowercaseInput.includes('nadaswaram') || 
      lowercaseInput.includes('mangala') || lowercaseInput.includes('tavil')) {
    return 'music';
  }
  
  if (lowercaseInput.includes('decor') || lowercaseInput.includes('decoration') || 
      lowercaseInput.includes('flower') || lowercaseInput.includes('stage')) {
    return 'decoration';
  }
  
  if (lowercaseInput.includes('hall') || lowercaseInput.includes('venue') || 
      lowercaseInput.includes('function hall') || lowercaseInput.includes('space')) {
    return 'functionHall';
  }
  
  // General intent patterns
  if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi') || 
      lowercaseInput.includes('hey') || lowercaseInput.includes('namaste')) {
    return 'greeting';
  }
  
  if (lowercaseInput.includes('book') || lowercaseInput.includes('reservation') || 
      lowercaseInput.includes('how to book') || lowercaseInput.includes('process')) {
    return 'booking';
  }
  
  if (lowercaseInput.includes('price') || lowercaseInput.includes('cost') || 
      lowercaseInput.includes('rate') || lowercaseInput.includes('fee') || 
      lowercaseInput.includes('charge')) {
    return 'pricing';
  }
  
  if (lowercaseInput.includes('location') || lowercaseInput.includes('area') || 
      lowercaseInput.includes('city') || lowercaseInput.includes('where')) {
    return 'locations';
  }
  
  if (lowercaseInput.includes('contact') || lowercaseInput.includes('phone') || 
      lowercaseInput.includes('email') || lowercaseInput.includes('reach')) {
    return 'contact';
  }
  
  if (lowercaseInput.includes('about') || lowercaseInput.includes('who are you') || 
      lowercaseInput.includes('what is subhakary')) {
    return 'about';
  }
  
  return null;
};

export const getResponse = (intent: string): ChatResponse | null => {
  // Check service responses first
  if (serviceResponses[intent]) {
    return serviceResponses[intent];
  }
  
  // Then check general responses
  if (generalResponses[intent]) {
    return generalResponses[intent];
  }
  
  return null;
};

export const defaultResponse: ChatResponse = {
  message: `I'd be happy to help! I can assist you with:\n\n🕉️ **Services**\n• Poojari services\n• Mehendi & Makeup\n• Photography\n• Catering\n• Music (Mangala Vayudhyam)\n• Decoration\n• Function Halls\n\n📋 **Information**\n• Booking process\n• Pricing details\n• Service areas\n• Contact information\n\nWhat would you like to know more about?`,
  quickReplies: ['View Services', 'How to Book', 'Pricing Info']
};
