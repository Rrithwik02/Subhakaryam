import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AudioUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  className?: string;
  maxFiles?: number;
}

export function AudioUpload({ value, onChange, className, maxFiles = 5 }: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, or OGG)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Audio file must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `audio-samples/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("portfolio_images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio_images")
        .getPublicUrl(filePath);

      onChange([...value, publicUrl]);

      toast({
        title: "Success",
        description: "Audio sample uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload audio sample",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <Label className="text-base">Audio Samples</Label>
      <p className="text-sm text-muted-foreground mb-2">
        Upload sample recordings of your performances
      </p>

      <div className="space-y-3">
        {value.map((url, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded">
            <audio src={url} controls className="flex-1 h-8" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {value.length < maxFiles && (
          <div>
            <input
              type="file"
              accept="audio/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id="audio-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("audio-upload")?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Audio Sample ({value.length}/{maxFiles})
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}