import { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMobileFeatures } from '@/hooks/use-mobile-features';
import { useToast } from '@/hooks/use-toast';

interface MobileCameraUploadProps {
  onImageCapture: (imageData: string) => void;
  children?: React.ReactNode;
}

export function MobileCameraUpload({ onImageCapture, children }: MobileCameraUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isNative, takePicture, triggerHaptic } = useMobileFeatures();
  const { toast } = useToast();

  const handleCameraCapture = async () => {
    try {
      triggerHaptic('medium');
      const imageData = await takePicture('camera');
      if (imageData) {
        onImageCapture(imageData);
        setIsOpen(false);
        toast({
          title: "Photo captured!",
          description: "Your photo has been captured successfully.",
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const handleGallerySelect = async () => {
    try {
      triggerHaptic('medium');
      const imageData = await takePicture('gallery');
      if (imageData) {
        onImageCapture(imageData);
        setIsOpen(false);
        toast({
          title: "Photo selected!",
          description: "Your photo has been selected from gallery.",
        });
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
    }
  };

  if (!isNative) {
    return children || null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            Add Photo
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>Add Photo</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={handleCameraCapture}
            className="flex items-center justify-center h-16 text-lg"
            variant="outline"
          >
            <Camera className="h-6 w-6 mr-3" />
            Take Photo
          </Button>
          <Button
            onClick={handleGallerySelect}
            className="flex items-center justify-center h-16 text-lg"
            variant="outline"
          >
            <ImageIcon className="h-6 w-6 mr-3" />
            Choose from Gallery
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}