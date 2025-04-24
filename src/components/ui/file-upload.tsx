import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUploading?: (isUploading: boolean) => void;
}

export function FileUpload({ value, onChange, onUploading }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    if (onUploading) onUploading(true);

    try {
      // Create a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      toast({
        title: "File uploaded successfully",
        description: "Your image has been uploaded",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Error uploading file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (onUploading) onUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      {!value ? (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-blue-50 rounded-full">
              <UploadCloud className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drag and drop an image or click to browse
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG or GIF up to 5MB
              </p>
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="sr-only"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                className="cursor-pointer"
                asChild
              >
                <span>
                  {isUploading ? "Uploading..." : "Select File"}
                </span>
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={value}
            alt="Uploaded image"
            className="object-cover rounded-md max-h-64 w-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
