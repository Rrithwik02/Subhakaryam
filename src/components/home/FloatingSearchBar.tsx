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
        <div className="bg-white backdrop-blur-md rounded-full shadow-2xl p-2 border border-gray-100">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-1">
            {/* Service Type */}
            <div className="flex-1 px-4 border-r border-gray-200">
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 h-12 bg-transparent">
                  <SelectValue placeholder="Service Type" />
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

            {/* Date */}
            <div className="flex-1 px-4 border-r border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-ceremonial-gold" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 bg-transparent"
                  placeholder="Select Date"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex-1 px-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ceremonial-gold" />
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 bg-transparent"
                  placeholder="Location"
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
          <div className="flex flex-col gap-2 md:hidden p-2">
            {/* Service Type */}
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="border border-gray-200 focus:ring-2 focus:ring-ceremonial-gold h-[48px] bg-white rounded-lg">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[100]">
                {serviceCategories.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-[48px] bg-white">
              <Calendar className="w-5 h-5 text-ceremonial-gold flex-shrink-0" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full bg-transparent"
                placeholder="Select Date"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-[48px] bg-white">
              <MapPin className="w-5 h-5 text-ceremonial-gold flex-shrink-0" />
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full bg-transparent"
                placeholder="Location"
              />
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
