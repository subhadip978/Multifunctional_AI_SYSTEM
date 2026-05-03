import { useState, useCallback } from "react";

interface UseImageUploadReturn {
  uploadedImages: string[];
  isUploading: boolean;
  uploadError: string | null;
  handleFileUpload: (files: FileList | File[]) => Promise<void>;
  handleDownloadAll: (imageRefs: React.MutableRefObject<(HTMLImageElement | null)[]>) => void;
  resetUpload: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    setIsUploading(true);
    setUploadError(null);

    const fileArray = Array.from(files);
    if (fileArray.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return data.publicId;
      });

      const publicIds = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...publicIds]);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "An error occurred during batch upload");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDownloadAll = useCallback((imageRefs: React.MutableRefObject<(HTMLImageElement | null)[]>) => {
    imageRefs.current.forEach((img, index) => {
      if (!img) return;
      
      fetch(img.src)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `transformed-image-${index + 1}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => console.error("Download failed:", error));
    });
  }, []);

  const resetUpload = useCallback(() => {
    setUploadedImages([]);
    setUploadError(null);
  }, []);

  return {
    uploadedImages,
    isUploading,
    uploadError,
    handleFileUpload,
    handleDownloadAll,
    resetUpload
  };
}
