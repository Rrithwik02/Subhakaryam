import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const SimpleThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState("default");

  const themes = [
    { id: "default", name: "Classic", colors: ["#8B4513", "#DAA520", "#CD853F"] },
    { id: "modern", name: "Modern", colors: ["#6B46C1", "#EC4899", "#F59E0B"] },
    { id: "traditional", name: "Traditional", colors: ["#DC2626", "#F59E0B", "#059669"] },
    { id: "elegant", name: "Elegant", colors: ["#1F2937", "#6B7280", "#D1D5DB"] }
  ];

  const applyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    // Simple theme application could be added here
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="h-5 w-5" />
          Choose Theme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant={selectedTheme === theme.id ? "default" : "outline"}
            className="w-full justify-between h-auto p-3"
            onClick={() => applyTheme(theme.id)}
          >
            <span>{theme.name}</span>
            <div className="flex gap-1">
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default SimpleThemeSelector;