import React from 'react';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
interface PhotoUploadProps {
  photos: string[];
  onUpload: (files: FileList) => void;
  onRemove: (index: number) => void;
  maxPhotos?: number;
}
export function PhotoUpload({
  photos,
  onUpload,
  onRemove,
  maxPhotos = 5
}: PhotoUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {photos.map((photo, index) =>
        <div
          key={index}
          className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">

            <img
            src={photo}
            alt={`Upload ${index + 1}`}
            className="w-full h-full object-cover" />

            <button
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">

              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {photos.length < maxPhotos &&
        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-navy-500 hover:bg-navy-50 transition-colors">
            <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange} />

            <Camera className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-xs font-medium text-gray-500 text-center px-2">
              Add Photo
            </span>
          </label>
        }
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {photos.length} of {maxPhotos} photos
        </span>
        <span>JPG, PNG • Max 5MB</span>
      </div>
    </div>);

}
interface PhotoGalleryProps {
  photos: string[];
  onPhotoClick?: (index: number) => void;
}
export function PhotoGallery({ photos, onPhotoClick }: PhotoGalleryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {photos.map((photo, index) =>
      <div
        key={index}
        onClick={() => onPhotoClick && onPhotoClick(index)}
        className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 shadow-sm">

          <img
          src={photo}
          alt={`Gallery ${index + 1}`}
          className="w-full h-full object-cover" />

        </div>
      )}
    </div>);

}