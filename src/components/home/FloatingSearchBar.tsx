import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { serviceCategories } from "@/data/services";

const FloatingSearchBar = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (serviceType) params.append("service", serviceType);
    if (date) params.append("date", date);
    if (location) params.append("location", location);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-4">
      <div className="bg-heritage-cream rounded-full shadow-2xl p-2 border border-heritage-warm-gold/20">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-1">
          {/* Section 1: Service Type */}
          <div className="flex items-center gap-3 flex-1 px-5 py-4 rounded-full hover:bg-heritage-warm-gold/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-heritage-warm-gold/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-heritage-warm-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-heritage-maroon-text uppercase tracking-wider block mb-1">
                Service
              </label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger 
                  className="border-0 focus:ring-0 h-auto bg-transparent p-0 text-heritage-maroon-text font-medium"
                  aria-label="Select service type"
                >
                  <SelectValue placeholder="Choose service" />
                </SelectTrigger>
                <SelectContent className="bg-heritage-cream border-heritage-warm-gold/20">
                  {serviceCategories.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-heritage-maroon-text">
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-heritage-warm-gold/20" />

          {/* Section 2: Date */}
          <div className="flex items-center gap-3 flex-1 px-5 py-4 rounded-full hover:bg-heritage-warm-gold/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-heritage-warm-gold/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-heritage-warm-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-heritage-maroon-text uppercase tracking-wider block mb-1">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-0 focus-visible:ring-0 h-auto p-0 bg-transparent text-heritage-maroon-text font-medium"
                aria-label="Select event date"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-heritage-warm-gold/20" />

          {/* Section 3: Location */}
          <div className="flex items-center gap-3 flex-1 px-5 py-4 rounded-full hover:bg-heritage-warm-gold/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-heritage-warm-gold/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-heritage-warm-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-heritage-maroon-text uppercase tracking-wider block mb-1">
                Location
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 focus-visible:ring-0 h-auto p-0 bg-transparent text-heritage-maroon-text font-medium"
                placeholder="Enter location"
                aria-label="Enter location"
              />
            </div>
          </div>

          {/* Circular Gold Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-heritage-warm-gold hover:bg-heritage-warm-gold/90 text-heritage-maroon-text rounded-full h-14 w-14 flex-shrink-0 shadow-lg hover:shadow-xl transition-all"
            size="icon"
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col gap-3 md:hidden p-2">
          {/* Service Type */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border border-heritage-warm-gold/10">
            <div className="w-10 h-10 rounded-full bg-heritage-warm-gold/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-heritage-warm-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-heritage-maroon-text uppercase tracking-wider block mb-1">
                Service
              </label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger 
                  className="border-0 focus:ring-0 h-auto bg-transparent p-0 text-heritage-maroon-text font-medium"
                  aria-label="Select service type"
                >
                  <SelectValue placeholder="Choose service" />
                </SelectTrigger>
                <SelectContent className="bg-heritage-cream border-heritage-warm-gold/20">
                  {serviceCategories.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-heritage-maroon-text">
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border border-heritage-warm-gold/10">
            <div className="w-10 h-10 rounded-full bg-heritage-warm-gold/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-heritage-warm-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-heritage-maroon-text uppercase tracking-wider block mb-1">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-0 focus-visible:ring-0 h-auto p-0 bg-transparent text-heritage-maroon-text font-medium"
                aria-label="Select event date"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border border-heritage-warm-gold/10">
            <div className="w-10 h-10 rounded-full bg-heritage-warm-gold/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-heritage-warm-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-heritage-maroon-text uppercase tracking-wider block mb-1">
                Location
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 focus-visible:ring-0 h-auto p-0 bg-transparent text-heritage-maroon-text font-medium"
                placeholder="Enter location"
                aria-label="Enter location"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-heritage-warm-gold hover:bg-heritage-warm-gold/90 text-heritage-maroon-text rounded-full h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingSearchBar;
