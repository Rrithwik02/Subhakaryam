export type ServiceProvider = {
  id: string;
  name: string;
  service: string;
  rating: number;
  price: number;
  description: string;
  image: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
};