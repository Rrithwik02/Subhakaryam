import { 
  UserRoundCog, 
  Paintbrush2, 
  Camera, 
  UtensilsCrossed, 
  Music2, 
  Flower2
} from "lucide-react";

export const serviceCategories: ServiceCategory[] = [
  {
    id: "poojari",
    name: "Poojari Services",
    description: "Expert priests for all traditional ceremonies",
    icon: UserRoundCog,
    basePrice: 5000,
  },
  {
    id: "mehendi",
    name: "Mehendi & Makeup",
    description: "Professional beauty services for your special day",
    icon: Paintbrush2,
    basePrice: 8000,
  },
  {
    id: "photo",
    name: "Photography & Videography",
    description: "Capture your precious moments",
    icon: Camera,
    basePrice: 15000,
  },
  {
    id: "catering",
    name: "Catering",
    description: "Delicious traditional cuisine",
    icon: UtensilsCrossed,
    basePrice: 25000,
  },
  {
    id: "music",
    name: "Mangala Vayudhyam",
    description: "Traditional musical accompaniment",
    icon: Music2,
    basePrice: 10000,
  },
  {
    id: "decoration",
    name: "Decoration",
    description: "Beautiful traditional decorations",
    icon: Flower2,
    basePrice: 20000,
  },
];