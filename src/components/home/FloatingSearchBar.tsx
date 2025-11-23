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
    <div className="relative z-20 w-full max-w-5xl mx-auto px-4">
      <div className="w-full">
        <div className="bg-white rounded-full shadow-2xl p-1.5 border border-gray-100">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center">
            {/* Service Type */}
            <div className="flex items-center gap-2 flex-1 px-4 py-3 border-r border-gray-200">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger 
                  className="border-0 focus:ring-0 focus:ring-offset-0 h-auto bg-transparent p-0 text-sm"
                  aria-label="Select service type"
                >
                  <SelectValue placeholder="Choose service" />
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
            <div className="flex items-center gap-2 flex-1 px-4 py-3 border-r border-gray-200">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent text-sm"
                placeholder="Event date"
                aria-label="Select event date"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 flex-1 px-4 py-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 bg-transparent text-sm"
                placeholder="Enter location"
                aria-label="Enter location"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              size="icon"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 w-12 flex-shrink-0 mr-1.5"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col gap-2 md:hidden p-2">
            {/* Service Type */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-[48px] bg-white">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger 
                  className="border-0 focus:ring-0 focus:ring-offset-0 h-auto bg-transparent p-0"
                  aria-label="Select service type"
                >
                  <SelectValue placeholder="Choose service" />
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
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-[48px] bg-white">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full bg-transparent"
                placeholder="Event date"
                aria-label="Select event date"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-[48px] bg-white">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full bg-transparent"
                placeholder="Enter location"
                aria-label="Enter location"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-[48px] font-semibold w-full"
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
