
import { 
  UserRoundCog, 
  Brush,
  Camera, 
  UtensilsCrossed, 
  Music2, 
  Flower2,
  Building2 // Added for Function Hall
} from "lucide-react";
import { ServiceCategory } from "../types/services";

export const serviceCategories: ServiceCategory[] = [
  {
    id: "poojari",
    name: "Poojari Services",
    description: "Expert priests for all traditional ceremonies",
    icon: UserRoundCog,
    basePrice: 5000,
    subcategories: [
      { id: "wedding", name: "Wedding Ceremonies", priceRange: { min: 8000, max: 25000 } },
      { id: "housewarming", name: "Housewarming Pooja", priceRange: { min: 3000, max: 8000 } },
      { id: "festival", name: "Festival Celebrations", priceRange: { min: 2000, max: 6000 } },
      { id: "personal", name: "Personal Prayers", priceRange: { min: 1500, max: 4000 } },
      { id: "corporate", name: "Corporate Events", priceRange: { min: 5000, max: 15000 } },
      { id: "other", name: "Other Ceremonies", priceRange: { min: 2000, max: 10000 } }
    ]
  },
  {
    id: "mehendi",
    name: "Mehendi Artists",
    description: "Traditional mehendi art for your special occasions",
    icon: Brush,
    basePrice: 3000,
    subcategories: [
      { id: "bridal", name: "Bridal Mehendi", priceRange: { min: 8000, max: 30000 } },
      { id: "arabic", name: "Arabic Mehendi", priceRange: { min: 2000, max: 8000 } },
      { id: "traditional", name: "Traditional Mehendi", priceRange: { min: 1500, max: 6000 } },
      { id: "festival", name: "Festival Mehendi", priceRange: { min: 1000, max: 5000 } },
      { id: "simple", name: "Simple Mehendi", priceRange: { min: 800, max: 3000 } },
      { id: "other", name: "Other Occasions", priceRange: { min: 1000, max: 5000 } }
    ]
  },
  {
    id: "makeup",
    name: "Makeup Artists",
    description: "Professional makeup services for all occasions",
    icon: Brush,
    basePrice: 5000,
    subcategories: [
      { id: "bridal", name: "Bridal Makeup", priceRange: { min: 15000, max: 50000 } },
      { id: "party", name: "Party Makeup", priceRange: { min: 3000, max: 12000 } },
      { id: "engagement", name: "Engagement Makeup", priceRange: { min: 5000, max: 20000 } },
      { id: "hd", name: "HD Makeup", priceRange: { min: 8000, max: 25000 } },
      { id: "airbrush", name: "Airbrush Makeup", priceRange: { min: 10000, max: 30000 } },
      { id: "other", name: "Other Occasions", priceRange: { min: 2000, max: 10000 } }
    ]
  },
  {
    id: "photo",
    name: "Photography & Videography",
    description: "Capture your precious moments",
    icon: Camera,
    basePrice: 15000,
    subcategories: [
      { id: "wedding", name: "Wedding Photography", priceRange: { min: 50000, max: 200000 } },
      { id: "birthday", name: "Birthday Photography", priceRange: { min: 5000, max: 15000 } },
      { id: "corporate", name: "Corporate Events", priceRange: { min: 10000, max: 40000 } },
      { id: "product", name: "Product Photography", priceRange: { min: 3000, max: 15000 } },
      { id: "portrait", name: "Portrait Sessions", priceRange: { min: 2000, max: 8000 } },
      { id: "event", name: "Event Photography", priceRange: { min: 8000, max: 30000 } },
      { id: "other", name: "Other Photography", priceRange: { min: 3000, max: 20000 } }
    ]
  },
  {
    id: "catering",
    name: "Catering",
    description: "Delicious traditional cuisine",
    icon: UtensilsCrossed,
    basePrice: 25000,
    subcategories: [
      { id: "wedding", name: "Wedding Catering", priceRange: { min: 80000, max: 500000 } },
      { id: "birthday", name: "Birthday Catering", priceRange: { min: 8000, max: 30000 } },
      { id: "corporate", name: "Corporate Catering", priceRange: { min: 15000, max: 80000 } },
      { id: "festival", name: "Festival Catering", priceRange: { min: 10000, max: 50000 } },
      { id: "home_party", name: "Home Party", priceRange: { min: 5000, max: 20000 } },
      { id: "other", name: "Other Events", priceRange: { min: 8000, max: 40000 } }
    ]
  },
  {
    id: "music",
    name: "Mangala Vayudhyam",
    description: "Traditional musical accompaniment",
    icon: Music2,
    basePrice: 10000,
    subcategories: [
      { id: "wedding", name: "Wedding Music", priceRange: { min: 15000, max: 60000 } },
      { id: "religious", name: "Religious Ceremonies", priceRange: { min: 5000, max: 20000 } },
      { id: "cultural", name: "Cultural Events", priceRange: { min: 8000, max: 30000 } },
      { id: "background", name: "Background Music", priceRange: { min: 3000, max: 12000 } },
      { id: "festival", name: "Festival Performances", priceRange: { min: 6000, max: 25000 } },
      { id: "other", name: "Other Events", priceRange: { min: 4000, max: 18000 } }
    ]
  },
  {
    id: "decoration",
    name: "Decoration",
    description: "Beautiful traditional decorations",
    icon: Flower2,
    basePrice: 20000,
    subcategories: [
      { id: "wedding", name: "Wedding Decoration", priceRange: { min: 40000, max: 300000 } },
      { id: "birthday", name: "Birthday Decoration", priceRange: { min: 5000, max: 25000 } },
      { id: "corporate", name: "Corporate Events", priceRange: { min: 15000, max: 80000 } },
      { id: "festival", name: "Festival Decoration", priceRange: { min: 8000, max: 40000 } },
      { id: "theme", name: "Theme-based Decoration", priceRange: { min: 10000, max: 50000 } },
      { id: "other", name: "Other Occasions", priceRange: { min: 6000, max: 30000 } }
    ]
  },
  {
    id: "function_hall",
    name: "Function Hall",
    description: "Spacious venues for your special occasions",
    icon: Building2,
    basePrice: 50000,
    subcategories: [
      { id: "wedding", name: "Wedding Venues", priceRange: { min: 80000, max: 500000 } },
      { id: "corporate", name: "Corporate Events", priceRange: { min: 25000, max: 150000 } },
      { id: "birthday", name: "Birthday Celebrations", priceRange: { min: 15000, max: 60000 } },
      { id: "religious", name: "Religious Ceremonies", priceRange: { min: 20000, max: 100000 } },
      { id: "conference", name: "Conference Halls", priceRange: { min: 30000, max: 120000 } },
      { id: "other", name: "Other Events", priceRange: { min: 18000, max: 80000 } }
    ]
  },
];

export const getSubcategories = (serviceId: string) => {
  const service = serviceCategories.find(cat => cat.id === serviceId);
  return service?.subcategories || [];
};

export const getSubcategoryDetails = (serviceId: string, subcategoryId: string) => {
  const subcategories = getSubcategories(serviceId);
  return subcategories.find(sub => sub.id === subcategoryId);
};

export const serviceImages: Record<string, string> = {
  poojari: "https://images.unsplash.com/photo-1605552955557-8b05236e6a06?w=800&h=600&fit=crop&q=80",
  mehendi: "https://images.unsplash.com/photo-1610088441520-4352457e7095?w=800&h=600&fit=crop&q=80",
  makeup: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop&q=80",
  photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop&q=80",
  catering: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=80",
  music: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop&q=80",
  decoration: "https://images.unsplash.com/photo-1519167758481-83f29da8c8f0?w=800&h=600&fit=crop&q=80",
  function_hall: "https://images.unsplash.com/photo-1519167758481-83f29da8c8f0?w=800&h=600&fit=crop&q=80"
};
