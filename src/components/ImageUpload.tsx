import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUploadSuccess: (newBase64: string) => void;
}

export function ImageUpload({ currentImageUrl, onUploadSuccess }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setUploading(true);
      try {
        await api.post('/api/upload/profile', { imageBase64: base64String });
        toast.success("Profile image updated");
        onUploadSuccess(base64String);
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative group w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      {uploading ? (
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      ) : currentImageUrl ? (
        <img src={currentImageUrl} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-400 font-medium text-xl">No Pfp</span>
      )}
      
      {/* Hover Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="text-white w-8 h-8" />
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        className="hidden" 
      />
    </div>
  );
}
