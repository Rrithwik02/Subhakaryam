import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search } from "lucide-react";
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
    <div className="relative z-20 w-full max-w-4xl mx-auto px-4">
      <div className="w-full">
        <div className="bg-white backdrop-blur-md rounded-full shadow-2xl p-2 border border-gray-100 hover:border-ceremonial-gold/30 transition-colors duration-300">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-1">
            {/* Service Type */}
            <div className="flex-1 px-4 border-r border-gray-200">
              <label htmlFor="service-type" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block">
                Service Type
              </label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger 
                  id="service-type"
                  className="border-0 focus:ring-0 focus:ring-offset-0 h-10 bg-transparent"
                  aria-label="Select service type"
                >
                  <SelectValue placeholder="What service do you need?" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {serviceCategories.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Date */}
            <div className="flex-1 px-4 border-r border-gray-200">
              <label htmlFor="event-date" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block">
                Event Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ceremonial-gold flex-shrink-0" />
                <Input
                  id="event-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 bg-transparent"
                  placeholder="When is your event?"
                  aria-label="Select event date"
                />
              </div>
            </div>

            {/* Where */}
            <div className="flex-1 px-4">
              <label htmlFor="location" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block">
                Where
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ceremonial-gold flex-shrink-0" />
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 bg-transparent"
                  placeholder="Enter your location"
                  aria-label="Enter location"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white rounded-full h-12 px-8 font-semibold"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 md:hidden p-2">
            {/* Service Type */}
            <div>
              <label htmlFor="service-type-mobile" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block px-1">
                Service Type
              </label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger 
                  id="service-type-mobile"
                  className="border border-gray-200 focus:ring-2 focus:ring-ceremonial-gold h-[48px] bg-white rounded-lg"
                  aria-label="Select service type"
                >
                  <SelectValue placeholder="What service do you need?" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {serviceCategories.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Date */}
            <div>
              <label htmlFor="event-date-mobile" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block px-1">
                Event Date
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-[48px] bg-white">
                <Calendar className="w-5 h-5 text-ceremonial-gold flex-shrink-0" />
                <Input
                  id="event-date-mobile"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full bg-transparent"
                  placeholder="When is your event?"
                  aria-label="Select event date"
                />
              </div>
            </div>

            {/* Where */}
            <div>
              <label htmlFor="location-mobile" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block px-1">
                Where
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-[48px] bg-white">
                <MapPin className="w-5 h-5 text-ceremonial-gold flex-shrink-0" />
                <Input
                  id="location-mobile"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full bg-transparent"
                  placeholder="Enter your location"
                  aria-label="Enter location"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-ceremonial-maroon hover:bg-ceremonial-maroon/90 text-white rounded-lg h-[48px] font-semibold w-full"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSearchBar;
