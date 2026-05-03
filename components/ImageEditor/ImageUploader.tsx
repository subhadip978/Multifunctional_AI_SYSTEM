import React, { useRef } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ImageUploaderProps {
  onUpload: (files: FileList | File[]) => void;
  isUploading: boolean;
}

export function ImageUploader({ onUpload, isUploading }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <Card className="border-dashed border-2 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Uploading images...</p>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center gap-4 cursor-pointer w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-4 bg-primary/10 rounded-full">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Click to upload images</h3>
              <p className="text-sm text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 10MB). You can select multiple files.</p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </CardContent>
    </Card>
  );
}
