/**
 * PropertyImageManager Component
 * Handles image upload, preview, and management for properties
 */
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Plus,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

export interface PropertyImage {
  id?: string;
  url: string;
  name: string;
  file?: File;
  isNew?: boolean;
}

interface PropertyImageManagerProps {
  images: PropertyImage[];
  onImagesChange: (images: PropertyImage[]) => void;
  maxImages?: number;
  className?: string;
}

export const PropertyImageManager: React.FC<PropertyImageManagerProps> = ({
  images = [],
  onImagesChange,
  maxImages = 10,
  className = ''
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    console.log('handleFileSelect called with files:', files);
    console.log('handleFileSelect - files count:', files?.length || 0);
    if (!files || files.length === 0) {
      console.log('No files provided');
      return;
    }

    const newImages: PropertyImage[] = [];
    console.log('Processing files:', Array.from(files).map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    Array.from(files).forEach((file) => {
      console.log('Processing file:', file.name, 'type:', file.type, 'isImage:', file.type.startsWith('image/'));
      if (file.type.startsWith('image/') && images.length + newImages.length < maxImages) {
        const imageUrl = URL.createObjectURL(file);
        const newImage = {
          id: `temp-${Date.now()}-${Math.random()}`,
          url: imageUrl,
          name: file.name,
          file: file,
          isNew: true
        };
        console.log('Adding new image:', newImage);
        newImages.push(newImage);
      } else {
        console.log('Skipping file:', file.name, 'reason:', !file.type.startsWith('image/') ? 'not an image' : 'max images reached');
      }
    });

    console.log('New images to add:', newImages.length);
    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      console.log('Calling onImagesChange with:', updatedImages.length, 'total images');
      onImagesChange(updatedImages);
    } else {
      console.log('No new images to add');
    }
    
    // Clear the file input to prevent duplicate processing
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (imageId: string) => {
    const imageToRemove = images.find(img => img.id === imageId);
    console.log('Removing image:', { imageId, imageToRemove, totalImages: images.length });
    
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this image? This action cannot be undone.');
    if (!confirmed) {
      return;
    }
    
    const updatedImages = images.filter(img => img.id !== imageId);
    console.log('After removal:', { remainingImages: updatedImages.length, updatedImages });
    
    onImagesChange(updatedImages);
  };

  // const moveImage = (fromIndex: number, toIndex: number) => {
  //   const updatedImages = [...images];
  //   const [movedImage] = updatedImages.splice(fromIndex, 1);
  //   updatedImages.splice(toIndex, 0, movedImage);
  //   onImagesChange(updatedImages);
  // };

  const openFileDialog = () => {
    console.log('openFileDialog called, fileInputRef.current:', fileInputRef.current);
    if (fileInputRef.current) {
      console.log('Clicking file input');
      fileInputRef.current.click();
    } else {
      console.error('File input ref is null');
    }
  };

  const downloadImage = (image: PropertyImage) => {
    if (image.file) {
      const url = URL.createObjectURL(image.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // For existing images from server
      const a = document.createElement('a');
      a.href = image.url;
      a.download = image.name;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <ImageIcon className="w-5 h-5 mr-2" />
            Property Images ({images.length}/{maxImages})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFileDialog}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports JPG, PNG, GIF up to 10MB each
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              disabled={images.length >= maxImages}
            >
              <Plus className="w-4 h-4 mr-2" />
              Select Images
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setPreviewImage(image.url)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadImage(image)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(image.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Image info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs">
                      <p className="truncate">{image.name}</p>
                      {image.isNew && (
                        <span className="text-green-400">New</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-4xl p-4">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={() => setPreviewImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
