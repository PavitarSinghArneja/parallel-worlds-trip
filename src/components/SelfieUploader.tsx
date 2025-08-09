import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';

interface SelfieUploaderProps {
  onComplete: (selfieUrl: string) => void;
}

export const SelfieUploader: React.FC<SelfieUploaderProps> = ({ onComplete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkip = () => {
    onComplete(''); // Continue without selfie
  };

  const handleUsePhoto = () => {
    if (selectedImage) {
      onComplete(selectedImage);
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div>
        <h2 className="text-2xl font-montserrat font-semibold mb-4">
          Add Your Photo (Optional)
        </h2>
        <p className="text-muted-foreground">
          Upload a selfie to see your parallel self more clearly, or skip to continue
        </p>
      </div>

      {selectedImage ? (
        <Card className="glass-card p-6">
          <img 
            src={selectedImage} 
            alt="Your selfie" 
            className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-2 border-primary"
          />
          <div className="space-y-4">
            <Button 
              onClick={handleUsePhoto}
              className="glass-button w-full"
            >
              Use This Photo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSelectedImage(null)}
              className="w-full"
            >
              Choose Different Photo
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="glass-card p-8">
          <div className="space-y-6">
            <div className="w-32 h-32 border-2 border-dashed border-primary/50 rounded-full mx-auto flex items-center justify-center">
              <Camera className="w-12 h-12 text-primary/50" />
            </div>
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="glass-button w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </Card>
      )}

      <Button 
        variant="ghost" 
        onClick={handleSkip}
        className="w-full"
      >
        Skip for now →
      </Button>
    </div>
  );
};