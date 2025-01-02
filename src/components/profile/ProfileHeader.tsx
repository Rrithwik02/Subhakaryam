import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Progress } from "@/components/ui/progress";

interface ProfileHeaderProps {
  businessName?: string;
  rating?: number;
  basePrice?: number;
  email?: string;
  phone?: string;
  city?: string;
  profileImage?: string;
  isServiceProvider?: boolean;
  onImageUpload?: (url: string) => void;
}

const ProfileHeader = ({
  businessName,
  rating,
  basePrice,
  email,
  phone,
  city,
  profileImage,
  isServiceProvider,
  onImageUpload,
}: ProfileHeaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { session } = useSessionContext();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);
      setUploadProgress(0);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const userId = session?.user?.id;
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      const { error: uploadError, data } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, { upsert: true });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      if (onImageUpload) {
        onImageUpload(publicUrl);
      }

      toast({
        title: "Success",
        description: isServiceProvider ? "Service logo updated successfully" : "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileImage} />
          <AvatarFallback>
            {businessName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <label 
          className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
          htmlFor="image-upload"
        >
          <Upload className="h-6 w-6" />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={uploading}
        />
      </div>
      {uploading && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-sm">
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{businessName}</h2>
        {(rating !== undefined || basePrice !== undefined) && (
          <div className="flex items-center gap-4">
            {rating !== undefined && (
              <div className="flex items-center gap-1">
                <span>⭐ {rating || "No ratings"}</span>
              </div>
            )}
            {basePrice !== undefined && (
              <div className="flex items-center gap-1">
                <span>₹{basePrice}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{phone || "Not provided"}</span>
        </div>
        {city && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{city}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;