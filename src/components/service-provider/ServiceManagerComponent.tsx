import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { serviceCategories, getSubcategories, getSubcategoryDetails } from "@/data/services";

interface ServiceItem {
  id: string;
  service_type: string;
  subcategory?: string;
  custom_service_name?: string;
  custom_subcategory_name?: string;
  min_price: number;
  max_price: number;
}

interface ServiceManagerComponentProps {
  onServicesChange: (services: ServiceItem[]) => void;
  initialServices?: ServiceItem[];
  className?: string;
}

export const ServiceManagerComponent = ({ 
  onServicesChange, 
  initialServices = [], 
  className = "" 
}: ServiceManagerComponentProps) => {
  const [services, setServices] = useState<ServiceItem[]>(
    initialServices.length > 0 ? initialServices : [
      {
        id: Date.now().toString(),
        service_type: "",
        subcategory: "",
        min_price: 0,
        max_price: 0
      }
    ]
  );

  const updateServices = (newServices: ServiceItem[]) => {
    setServices(newServices);
    onServicesChange(newServices);
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      service_type: "",
      subcategory: "",
      min_price: 0,
      max_price: 0
    };
    updateServices([...services, newService]);
  };

  const removeService = (id: string) => {
    if (services.length > 1) {
      updateServices(services.filter(service => service.id !== id));
    }
  };

  const updateService = (id: string, field: keyof ServiceItem, value: any) => {
    updateServices(services.map(service => {
      if (service.id === id) {
        const updatedService = { ...service, [field]: value };
        // Reset subcategory when service type changes
        if (field === 'service_type') {
          updatedService.subcategory = "";
          updatedService.custom_subcategory_name = "";
          // Update suggested pricing based on subcategory
          const subcategories = getSubcategories(value);
          if (subcategories.length > 0) {
            const firstSubcategory = subcategories[0];
            updatedService.min_price = firstSubcategory.priceRange.min;
            updatedService.max_price = firstSubcategory.priceRange.max;
          }
        }
        // Update pricing when subcategory changes
        if (field === 'subcategory' && value !== 'other') {
          const subcategoryDetails = getSubcategoryDetails(service.service_type, value);
          if (subcategoryDetails) {
            updatedService.min_price = subcategoryDetails.priceRange.min;
            updatedService.max_price = subcategoryDetails.priceRange.max;
          }
        }
        return updatedService;
      }
      return service;
    }));
  };

  const validatePriceRange = (minPrice: number, maxPrice: number) => {
    return minPrice > 0 && maxPrice > 0 && minPrice <= maxPrice;
  };

  return (
    <div className={className}>
      <Label className="text-lg font-semibold text-ceremonial-maroon">
        Services & Price Ranges
      </Label>
      <p className="text-sm text-gray-600 mb-4">
        Add at least one service with its price range
      </p>
      
      <div className="space-y-4">
        {services.map((service, index) => (
          <Card key={service.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-gray-800">Service #{index + 1}</h4>
              {services.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(service.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Type</Label>
                <Select 
                  value={service.service_type} 
                  onValueChange={(value) => updateService(service.id, 'service_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other (Custom Service)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {service.service_type && service.service_type !== "other" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Service Subcategory</Label>
                  <Select 
                    value={service.subcategory || ""} 
                    onValueChange={(value) => updateService(service.id, 'subcategory', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategories(service.service_type).map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                          <span className="text-xs text-gray-500 ml-2">
                            (₹{subcategory.priceRange.min.toLocaleString()} - ₹{subcategory.priceRange.max.toLocaleString()})
                          </span>
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (Custom Subcategory)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {service.service_type === "other" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Custom Service Name</Label>
                  <Input
                    value={service.custom_service_name || ""}
                    onChange={(e) => updateService(service.id, 'custom_service_name', e.target.value)}
                    placeholder="Enter service name"
                    required
                  />
                </div>
              )}

              {service.subcategory === "other" && service.service_type !== "other" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Custom Subcategory Name</Label>
                  <Input
                    value={service.custom_subcategory_name || ""}
                    onChange={(e) => updateService(service.id, 'custom_subcategory_name', e.target.value)}
                    placeholder="Enter subcategory name"
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Minimum Price (₹)</Label>
                <Input
                  type="number"
                  value={service.min_price || ""}
                  onChange={(e) => updateService(service.id, 'min_price', parseInt(e.target.value) || 0)}
                  placeholder="Min price"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Maximum Price (₹)</Label>
                <Input
                  type="number"
                  value={service.max_price || ""}
                  onChange={(e) => updateService(service.id, 'max_price', parseInt(e.target.value) || 0)}
                  placeholder="Max price"
                  min="1"
                  required
                />
              </div>
            </div>

            {service.min_price > 0 && service.max_price > 0 && !validatePriceRange(service.min_price, service.max_price) && (
              <p className="text-red-500 text-sm mt-2">
                Minimum price must be less than or equal to maximum price
              </p>
            )}

            {service.min_price > 0 && service.max_price > 0 && validatePriceRange(service.min_price, service.max_price) && (
              <p className="text-green-600 text-sm mt-2">
                Price range: ₹{service.min_price.toLocaleString()} - ₹{service.max_price.toLocaleString()}
              </p>
            )}
          </Card>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addService}
          className="w-full border-dashed border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Service
        </Button>
      </div>
    </div>
  );
};