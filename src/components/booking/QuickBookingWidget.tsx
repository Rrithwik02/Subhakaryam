import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickBookingWidget = () => {
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleQuickSearch = () => {
    const searchParams = new URLSearchParams();
    if (location) searchParams.set('city', location);
    if (service) searchParams.set('serviceType', service);
    
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-neuro">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-display text-foreground">
            Find Your Perfect Service
          </CardTitle>
          <p className="text-muted-foreground">Quick search to get started</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-foreground">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="Enter city..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-medium text-foreground">
                <Search className="inline h-4 w-4 mr-1" />
                Service Type
              </Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="pooja">Pooja Services</SelectItem>
                  <SelectItem value="photography">Wedding Photography</SelectItem>
                  <SelectItem value="mehendi">Mehendi Artists</SelectItem>
                  <SelectItem value="catering">Catering</SelectItem>
                  <SelectItem value="decoration">Decoration</SelectItem>
                  <SelectItem value="music">Music & Entertainment</SelectItem>
                  <SelectItem value="venue">Function Halls</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-foreground">
                <CalendarDays className="inline h-4 w-4 mr-1" />
                Date Needed
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            
            <Button 
              onClick={handleQuickSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10 min-h-[44px]"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Services
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickBookingWidget;