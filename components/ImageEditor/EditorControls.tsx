import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

export const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Twitter Header": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "YouTube Thumbnail (16:9)": { width: 1920, height: 1080, aspectRatio: "16:9" },
  "LinkedIn Cover (4:1)": { width: 1584, height: 396, aspectRatio: "4:1" },
};

export type SocialFormat = keyof typeof socialFormats;
export type GravityOption = 'auto' | 'faces' | 'center';

interface EditorControlsProps {
  selectedFormat: SocialFormat;
  setSelectedFormat: (format: SocialFormat) => void;
  removeBg: boolean;
  setRemoveBg: (val: boolean) => void;
  gravity: GravityOption;
  setGravity: (val: GravityOption) => void;
  genFill: boolean;
  setGenFill: (val: boolean) => void;
  watermark: string;
  setWatermark: (val: string) => void;
  onApply: () => void;
  onDownloadAll: () => void;
  onReset: () => void;
  isTransformed: boolean;
  isTransforming: boolean;
}

export function EditorControls({
  selectedFormat,
  setSelectedFormat,
  removeBg,
  setRemoveBg,
  gravity,
  setGravity,
  genFill,
  setGenFill,
  watermark,
  setWatermark,
  onApply,
  onDownloadAll,
  onReset,
  isTransformed,
  isTransforming
}: EditorControlsProps) {
  return (
    <Card className="w-full h-fit sticky top-6">
      <CardHeader>
        <CardTitle className="text-xl">Transformation Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Social Format</label>
          <select 
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {Object.keys(socialFormats).map((format) => (
              <option value={format} key={format}>{format}</option>
            ))}
          </select>
        </div>

        {/* Gravity / Smart Cropping */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Smart Cropping Focus</label>
          <select 
            value={gravity}
            onChange={(e) => setGravity(e.target.value as GravityOption)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="auto">Auto (Subject Detection)</option>
            <option value="faces">Faces (Facial Recognition)</option>
            <option value="center">Center (Standard)</option>
          </select>
        </div>

        {/* Watermark Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Text Watermark</label>
          <input 
            type="text"
            value={watermark}
            onChange={(e) => setWatermark(e.target.value)}
            placeholder="e.g. AI SaaS Media"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-2">
          {/* Background Removal */}
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="remove-bg" 
              checked={removeBg}
              onChange={(e) => setRemoveBg(e.target.checked)}
              className="h-4 w-4 rounded-sm border border-primary"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="remove-bg" className="text-sm font-medium">Remove Background</label>
              <p className="text-xs text-muted-foreground">Requires Cloudinary AI add-on.</p>
            </div>
          </div>

          {/* Generative Fill */}
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="gen-fill" 
              checked={genFill}
              onChange={(e) => setGenFill(e.target.checked)}
              className="h-4 w-4 rounded-sm border border-primary"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="gen-fill" className="text-sm font-medium">Generative Fill (Expand)</label>
              <p className="text-xs text-muted-foreground">Generates missing background to fit format.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3 border-t">
          <Button 
            className="w-full" 
            onClick={onApply}
            disabled={isTransforming}
          >
            {isTransforming ? (
              <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              'Apply Transformations'
            )}
          </Button>

          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={onDownloadAll}
            disabled={!isTransformed || isTransforming}
          >
            <Download className="mr-2 h-4 w-4" /> Download All
          </Button>

          <Button 
            variant="ghost" 
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" 
            onClick={onReset}
          >
            Start Over
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
