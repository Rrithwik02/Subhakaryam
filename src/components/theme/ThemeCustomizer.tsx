import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Eye, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface CeremonyTheme {
  id: string;
  theme_name: string;
  ceremony_type: string;
  color_scheme: any; // JSONB from database
  font_settings: any; // JSONB from database
  decorative_elements: any; // JSONB from database
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserThemePreference {
  id?: string;
  user_id: string;
  ceremony_type: string;
  theme_id: string;
  custom_settings?: any;
}

const ThemeCustomizer = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [themes, setThemes] = useState<CeremonyTheme[]>([]);
  const [selectedCeremonyType, setSelectedCeremonyType] = useState<string>("wedding");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [userPreferences, setUserPreferences] = useState<UserThemePreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchThemes();
    if (session?.user?.id) {
      fetchUserPreferences();
    }
  }, [session]);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from("ceremony_themes")
        .select("*")
        .eq("is_active", true)
        .order("ceremony_type", { ascending: true });

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error("Error fetching themes:", error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("user_theme_preferences")
        .select("*")
        .eq("user_id", session?.user?.id);

      if (error) throw error;
      setUserPreferences(data || []);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  const getFilteredThemes = () => {
    return themes.filter(theme => theme.ceremony_type === selectedCeremonyType);
  };

  const getCurrentPreference = () => {
    return userPreferences.find(pref => pref.ceremony_type === selectedCeremonyType);
  };

  const applyTheme = (theme: CeremonyTheme) => {
    if (!previewMode) return;

    // Apply theme colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.color_scheme.primary.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--secondary', theme.color_scheme.secondary.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--accent', theme.color_scheme.accent.replace('hsl(', '').replace(')', ''));
    root.style.setProperty('--background', theme.color_scheme.background.replace('hsl(', '').replace(')', ''));
  };

  const resetTheme = () => {
    // Reset to default theme
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--background');
  };

  const saveThemePreference = async () => {
    if (!session?.user?.id || !selectedTheme) return;

    setLoading(true);
    try {
      const preference: UserThemePreference = {
        user_id: session.user.id,
        ceremony_type: selectedCeremonyType,
        theme_id: selectedTheme
      };

      const { error } = await supabase
        .from("user_theme_preferences")
        .upsert(preference, { onConflict: "user_id,ceremony_type" });

      if (error) throw error;

      toast({
        title: "Theme Saved",
        description: `Theme preference saved for ${selectedCeremonyType} ceremonies.`,
      });

      await fetchUserPreferences();
    } catch (error) {
      console.error("Error saving theme preference:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save theme preference.",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePreview = () => {
    if (previewMode) {
      resetTheme();
    }
    setPreviewMode(!previewMode);
  };

  const ceremonyTypes = [
    { value: "wedding", label: "Wedding" },
    { value: "festival", label: "Festival" },
    { value: "pooja", label: "Pooja" },
    { value: "general", label: "General Ceremony" }
  ];

  const currentPreference = getCurrentPreference();
  const filteredThemes = getFilteredThemes();

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ceremony Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ceremony Type</label>
          <Select value={selectedCeremonyType} onValueChange={setSelectedCeremonyType}>
            <SelectTrigger>
              <SelectValue placeholder="Select ceremony type" />
            </SelectTrigger>
            <SelectContent>
              {ceremonyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Selection Display */}
        {currentPreference && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Current theme for {selectedCeremonyType}:</strong>{" "}
              {themes.find(t => t.id === currentPreference.theme_id)?.theme_name || "Unknown"}
            </p>
          </div>
        )}

        {/* Preview Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={togglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Exit Preview" : "Enable Preview"}
          </Button>
          {previewMode && (
            <Badge variant="secondary">Preview mode active</Badge>
          )}
        </div>

        {/* Theme Selection Grid */}
        <div className="space-y-4">
          <h3 className="font-semibold">Available Themes for {selectedCeremonyType}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredThemes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTheme === theme.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedTheme(theme.id);
                  if (previewMode) {
                    applyTheme(theme);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">{theme.theme_name}</h4>
                    
                    {/* Color Preview */}
                    <div className="flex gap-2">
                      {Object.entries(theme.color_scheme).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color as string }}
                          title={key}
                        />
                      ))}
                    </div>

                    {/* Font Info */}
                    <div className="text-sm text-muted-foreground">
                      <p>Primary: {theme.font_settings.primary}</p>
                      <p>Body: {theme.font_settings.body}</p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex flex-wrap gap-1">
                      {theme.decorative_elements.patterns.map((pattern, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Save Button */}
        {selectedTheme && (
          <Button
            onClick={saveThemePreference}
            disabled={loading}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Theme Preference"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer;