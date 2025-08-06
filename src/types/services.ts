import { LucideIcon } from "lucide-react";

export type ServiceProvider = {
  id: string;
  name: string;
  service: string;
  rating: number;
  price: number;
  description: string;
  image: string;
};

export type ServiceSubcategory = {
  id: string;
  name: string;
  priceRange: {
    min: number;
    max: number;
  };
};

export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  basePrice: number;
  subcategories?: ServiceSubcategory[];
};