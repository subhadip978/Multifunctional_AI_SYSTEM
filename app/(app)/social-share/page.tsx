"use client";

import React, { useState, useRef } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageUploader } from '@/components/ImageEditor/ImageUploader';
import { EditorControls, SocialFormat, GravityOption } from '@/components/ImageEditor/EditorControls';
import { PreviewPanel } from '@/components/ImageEditor/PreviewPanel';
import { LayoutTemplate } from 'lucide-react';

export default function SocialSharePage() {
  const {
    uploadedImages,
    isUploading,
    uploadError,
    handleFileUpload,
    handleDownloadAll,
    resetUpload
  } = useImageUpload();

  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [removeBg, setRemoveBg] = useState(false);
  const [gravity, setGravity] = useState<GravityOption>("auto");
  const [genFill, setGenFill] = useState(false);
  const [watermark, setWatermark] = useState("");
  
  const [isTransformed, setIsTransformed] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleApply = () => {
    setIsTransforming(true);
    setIsTransformed(true);
  };

  const handleFullReset = () => {
    resetUpload();
    setIsTransformed(false);
    setIsTransforming(false);
    setRemoveBg(false);
    setGravity("auto");
    setGenFill(false);
    setWatermark("");
    setSelectedFormat("Instagram Square (1:1)");
    imageRefs.current = [];
  };

  const triggerDownloadAll = () => {
    handleDownloadAll(imageRefs);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
          <LayoutTemplate className="h-10 w-10 text-primary" />
          Smart Batch Image Editor
        </h1>
        <p className="text-slate-500 mt-2 text-lg max-w-4xl">
          Upload multiple images and use Cloudinary's AI capabilities to automatically crop, optimize, remove backgrounds, generative fill, and add watermarks for various social media formats.
        </p>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
          <strong>Error:</strong> {uploadError}
        </div>
      )}

      {uploadedImages.length === 0 ? (
        <div className="max-w-2xl mx-auto mt-12">
          <ImageUploader 
            onUpload={handleFileUpload} 
            isUploading={isUploading} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Controls */}
          <div className="lg:col-span-3 w-full">
            <EditorControls 
              selectedFormat={selectedFormat}
              setSelectedFormat={(fmt) => {
                setSelectedFormat(fmt);
                setIsTransformed(false);
              }}
              removeBg={removeBg}
              setRemoveBg={(bg) => {
                setRemoveBg(bg);
                setIsTransformed(false);
              }}
              gravity={gravity}
              setGravity={(g) => {
                setGravity(g);
                setIsTransformed(false);
              }}
              genFill={genFill}
              setGenFill={(gf) => {
                setGenFill(gf);
                setIsTransformed(false);
              }}
              watermark={watermark}
              setWatermark={(wm) => {
                setWatermark(wm);
                setIsTransformed(false);
              }}
              onApply={handleApply}
              onDownloadAll={triggerDownloadAll}
              onReset={handleFullReset}
              isTransformed={isTransformed}
              isTransforming={isTransforming}
            />
          </div>

          {/* Right Main Preview Area */}
          <div className="lg:col-span-9 w-full overflow-y-auto max-h-[80vh] pr-2 pb-10">
            <PreviewPanel 
              uploadedImages={uploadedImages}
              selectedFormat={selectedFormat}
              removeBg={removeBg}
              gravity={gravity}
              genFill={genFill}
              watermark={watermark}
              isTransformed={isTransformed}
              isTransforming={isTransforming}
              setTransforming={setIsTransforming}
              imageRefs={imageRefs}
            />
          </div>
          
        </div>
      )}
    </div>
  );
}