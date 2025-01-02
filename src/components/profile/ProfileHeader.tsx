import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Upload } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

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
  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileImage} />
          <AvatarFallback>
            {businessName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        {onImageUpload && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageUpload
              onUploadComplete={onImageUpload}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>
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