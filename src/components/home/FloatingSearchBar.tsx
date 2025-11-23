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
import { Separator } from "@/components/ui/separator";
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
      <div className="bg-white rounded-full p-2 shadow-2xl border border-ceremonial-maroon/10">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-1">
          {/* Section 1: Service Type */}
          <div className="flex items-center gap-3 flex-1 px-5 py-4 rounded-full hover:bg-ceremonial-maroon/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-ceremonial-gold/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-ceremonial-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-ceremonial-maroon/70 uppercase tracking-wider block mb-1">
                Service
              </label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger 
                  className="border-0 focus:ring-0 h-auto bg-transparent p-0 text-ceremonial-maroon font-medium"
                >
                  <SelectValue placeholder="Choose service" />
                </SelectTrigger>
                <SelectContent className="bg-white border-ceremonial-maroon/20">
                  {serviceCategories.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-ceremonial-maroon">
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-ceremonial-maroon/10" />

          {/* Section 2: Date */}
          <div className="flex items-center gap-3 flex-1 px-5 py-4 rounded-full hover:bg-ceremonial-maroon/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-ceremonial-gold/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-ceremonial-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-ceremonial-maroon/70 uppercase tracking-wider block mb-1">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-0 focus-visible:ring-0 h-auto p-0 bg-transparent text-ceremonial-maroon font-medium"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-ceremonial-maroon/10" />

          {/* Section 3: Location */}
          <div className="flex items-center gap-3 flex-1 px-5 py-4 rounded-full hover:bg-ceremonial-maroon/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-ceremonial-gold/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-ceremonial-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-ceremonial-maroon/70 uppercase tracking-wider block mb-1">
                Location
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 focus-visible:ring-0 h-auto p-0 bg-transparent text-ceremonial-maroon font-medium placeholder:text-ceremonial-maroon/50"
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Circular Gold Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white rounded-full h-14 w-14 flex-shrink-0 shadow-lg hover:shadow-xl transition-all"
            size="icon"
          >
            <Search className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col gap-4 p-4">
          {/* Service Type */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ceremonial-gold/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-ceremonial-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-ceremonial-maroon/70 uppercase tracking-wider block mb-1">
                Service
              </label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="border-0 focus:ring-0 h-auto bg-transparent p-0 text-ceremonial-maroon font-medium">
                  <SelectValue placeholder="Choose service" />
                </SelectTrigger>
                <SelectContent className="bg-white border-ceremonial-maroon/20">
                  {serviceCategories.map((service) => (
                    <SelectItem key={service.id} value={service.id} className="text-ceremonial-maroon">
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-ceremonial-maroon/10" />

          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ceremonial-gold/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-ceremonial-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-ceremonial-maroon/70 uppercase tracking-wider block mb-1">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-0 focus-visible:ring-0 h-auto p-0 bg-transparent text-ceremonial-maroon font-medium"
              />
            </div>
          </div>

          <Separator className="bg-ceremonial-maroon/10" />

          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ceremonial-gold/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-ceremonial-gold" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-ceremonial-maroon/70 uppercase tracking-wider block mb-1">
                Location
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 focus-visible:ring-0 h-auto p-0 bg-transparent text-ceremonial-maroon font-medium placeholder:text-ceremonial-maroon/50"
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingSearchBar;