import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PortfolioImageViewerProps {
  images: string[];
}

export function PortfolioImageViewer({ images }: PortfolioImageViewerProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No portfolio images submitted
      </div>
    );
  }

  return (
    <>
      {/* Image Grid */}
      <div className={`grid gap-4 ${
        isMobile ? 'grid-cols-2' : 'grid-cols-3 md:grid-cols-4'
      }`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer rounded-lg overflow-hidden border"
            onClick={() => openImageModal(index)}
          >
            <img
              src={image}
              alt={`Portfolio ${index + 1}`}
              className="w-full h-24 md:h-32 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeImageModal}>
        <DialogContent className={`max-w-7xl ${isMobile ? 'w-full h-full max-h-full' : 'max-h-[90vh]'} p-0`}>
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={closeImageModal}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image Counter */}
            {selectedImageIndex !== null && (
              <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} of {images.length}
              </div>
            )}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Main Image */}
            {selectedImageIndex !== null && (
              <img
                src={images[selectedImageIndex]}
                alt={`Portfolio ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: isMobile ? '100vh' : '90vh' }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}