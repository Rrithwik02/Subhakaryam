
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "./progress";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  className?: string;
  maxSizeInBytes?: number;
  allowedFileTypes?: string[];
}

export function ImageUpload({ 
  onUploadComplete, 
  className,
  maxSizeInBytes = 5 * 1024 * 1024, // Default 5MB
  allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic"]
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];

      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
      }

      // Validate file size
      if (file.size > maxSizeInBytes) {
        throw new Error(`File size too large. Maximum size: ${maxSizeInBytes / (1024 * 1024)}MB`);
      }

      setUploading(true);
      setProgress(0);

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      const { error: uploadError, data } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setProgress(100);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
      });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        id="image-upload"
        accept={allowedFileTypes.join(',')}
        className="hidden"
        onChange={uploadImage}
        disabled={uploading}
      />
      <label htmlFor="image-upload">
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          disabled={uploading}
          asChild
        >
          <div className="flex items-center justify-center gap-2">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload Image"}
          </div>
        </Button>
      </label>
      {uploading && (
        <Progress value={progress} className="h-2 mt-2" />
      )}
    </div>
  );
}
