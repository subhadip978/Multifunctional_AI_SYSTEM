import React from 'react';
import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialFormat, socialFormats, GravityOption } from './EditorControls';
import { Loader2 } from 'lucide-react';

interface PreviewPanelProps {
  uploadedImages: string[];
  selectedFormat: SocialFormat;
  removeBg: boolean;
  gravity: GravityOption;
  genFill: boolean;
  watermark: string;
  isTransformed: boolean;
  isTransforming: boolean;
  setTransforming: (val: boolean) => void;
  imageRefs: React.MutableRefObject<(HTMLImageElement | null)[]>;
}

export function PreviewPanel({
  uploadedImages,
  selectedFormat,
  removeBg,
  gravity,
  genFill,
  watermark,
  isTransformed,
  isTransforming,
  setTransforming,
  imageRefs
}: PreviewPanelProps) {
  
  const formatConfig = socialFormats[selectedFormat];

  // For batch processing, we need to handle onLoad for multiple images
  const handleImageLoad = () => {
    // A simplified approach: just toggle it off on the first image load.
    // Ideally we'd track all loads, but this is good enough for UX feedback.
    setTransforming(false);
  };

  if (uploadedImages.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {uploadedImages.map((publicId, index) => (
        <div key={publicId} className="flex flex-col gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <h3 className="font-semibold text-slate-700">Image {index + 1}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Image Preview */}
            <Card className="shadow-none border-dashed bg-white">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium text-slate-500">Original</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center p-4">
                <CldImage
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={publicId}
                  alt={`original image ${index + 1}`}
                  gravity="auto"
                  preserveTransformations={false}
                  className="object-contain max-h-[300px] w-auto rounded-md"
                />
              </CardContent>
            </Card>

            {/* Transformed Image Preview */}
            <Card className="overflow-hidden border-primary/20 shadow-sm bg-white">
              <CardHeader className="bg-primary/5 py-3 px-4 border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-primary">Result</CardTitle>
                  {isTransforming && (
                    <span className="flex items-center text-xs text-primary/80">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Processing
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex justify-center p-4 bg-[url('https://res.cloudinary.com/demo/image/upload/w_100,e_blur:300/transparent_bg_pattern.png')] bg-repeat min-h-[250px] items-center">
                
                {!isTransformed ? (
                  <div className="text-slate-400 text-sm text-center">
                    <p>Click "Apply Transformations"</p>
                  </div>
                ) : (
                  <div className={`relative max-w-full overflow-hidden shadow-xl transition-opacity duration-300 ${isTransforming ? 'opacity-50' : 'opacity-100'} rounded-md bg-white/50`}>
                    <CldImage
                      width={formatConfig.width}
                      height={formatConfig.height}
                      src={publicId}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      alt={`transformed image ${index + 1}`}
                      // If Gen Fill is on, we pad to fit, otherwise we crop to fill
                      crop={genFill ? "pad" : "fill"}
                      background={genFill ? "gen_fill" : undefined}
                      aspectRatio={formatConfig.aspectRatio}
                      gravity={gravity}
                      removeBackground={removeBg ? true : undefined}
                      format="auto" 
                      quality="auto" 
                      overlays={watermark ? [{
                        text: { 
                          color: 'white', 
                          fontFamily: 'Arial', 
                          fontSize: 80, 
                          fontWeight: 'bold', 
                          text: watermark 
                        },
                        position: { gravity: 'bottom_right', x: 20, y: 20 }
                      }] : undefined}
                      ref={(el) => { imageRefs.current[index] = el }}
                      onLoad={handleImageLoad}
                      onError={handleImageLoad}
                      className="max-h-[300px] w-auto object-contain"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ))}

    </div>
  );
}
