import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  File, 
  Check, 
  AlertCircle,
  Loader2,
  Trash2,
  Download,
  Eye,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  bucket?: string;
  path?: string;
}

interface ImageGalleryProps {
  onImageSelect?: (images: UploadedFile[]) => void;
  multiple?: boolean;
  maxSelection?: number;
  showUploadButton?: boolean;
  className?: string;
  trigger?: React.ReactNode;
}

const ImageGallery = ({ 
  onImageSelect, 
  multiple = false, 
  maxSelection = 10,
  showUploadButton = true,
  className,
  trigger
}: ImageGalleryProps) => {
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<UploadedFile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isDialogOpen) {
      fetchImages();
    }
  }, [isDialogOpen]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all files from the images bucket
      const { data, error } = await supabase.storage
        .from('images')
        .list('', { limit: 100 });

      if (error) throw error;

      // Get public URLs for all files
      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(file.name);

          return {
            id: file.id || file.name,
            name: file.name,
            url: publicUrlData.publicUrl,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'image/jpeg',
            uploadedAt: file.created_at || new Date().toISOString(),
            bucket: 'images',
            path: file.name
          } as UploadedFile;
        })
      );

      // Filter only image files
      const imageFiles = filesWithUrls.filter(file => 
        file.type.startsWith('image/')
      );

      setImages(imageFiles);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (selectedFiles: FileList) => {
    setError(null);
    const newFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/')
    );

    if (newFiles.length === 0) {
      setError('Please select only image files');
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress < 90) {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: Math.min(progress, 90)
            }));
          }
        }, 200);

        try {
          const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, file);

          clearInterval(progressInterval);
          
          if (error) throw error;

          // Set progress to 100%
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100
          }));

          const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(data.path);

          return {
            id: data.id,
            name: file.name,
            url: publicUrlData.publicUrl,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            bucket: 'images',
            path: data.path
          } as UploadedFile;
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }
      });

      const results = await Promise.all(uploadPromises);
      
      setImages(prev => [...prev, ...results]);
      setFiles([]);
      setUploadProgress({});
      
      // Refresh the gallery
      await fetchImages();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const deleteImage = async (image: UploadedFile) => {
    try {
      if (image.path) {
        await supabase.storage
          .from('images')
          .remove([image.path]);
      }
      setImages(prev => prev.filter(img => img.id !== image.id));
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const toggleImageSelection = (image: UploadedFile) => {
    if (multiple) {
      if (selectedImages.some(img => img.id === image.id)) {
        setSelectedImages(prev => prev.filter(img => img.id !== image.id));
      } else {
        if (selectedImages.length < maxSelection) {
          setSelectedImages(prev => [...prev, image]);
        } else {
          setError(`Maximum ${maxSelection} images can be selected`);
        }
      }
    } else {
      setSelectedImages([image]);
    }
  };

  const handleConfirmSelection = () => {
    if (onImageSelect) {
      onImageSelect(selectedImages);
    }
    setIsDialogOpen(false);
    setSelectedImages([]);
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
            <ImageIcon className="h-4 w-4 mr-2" />
            Select Images
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white">Image Gallery</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[80vh] space-y-4">
          {/* Upload Section */}
          {showUploadButton && (
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label
                      htmlFor="gallery-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Images
                    </label>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">
                        {files.length} file{files.length > 1 ? 's' : ''} selected
                      </span>
                      <Button
                        onClick={uploadFiles}
                        disabled={uploading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Files to Upload */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-600 rounded">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-white">{file.name}</span>
                          <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {uploadProgress[file.name] && (
                            <div className="w-16">
                              <div className="w-full bg-slate-700 rounded-full h-1">
                                <div
                                  className="bg-blue-400 h-1 rounded-full transition-all"
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white pl-10 w-64"
                />
              </div>
              <Badge variant="outline" className="border-slate-600 text-gray-300">
                {filteredImages.length} images
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "text-gray-400 hover:text-white",
                  viewMode === 'grid' && "text-blue-400"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "text-gray-400 hover:text-white",
                  viewMode === 'list' && "text-blue-400"
                )}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Images Grid/List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No images found</p>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
                  : "space-y-2"
              )}>
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => toggleImageSelection(image)}
                    className={cn(
                      "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                      selectedImages.some(img => img.id === image.id)
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    )}
                  >
                    {viewMode === 'grid' ? (
                      <div className="aspect-square">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                        {selectedImages.some(img => img.id === image.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-3">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium truncate">{image.name}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(image.size)}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {selectedImages.some(img => img.id === image.id) && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteImage(image);
                            }}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="text-sm text-gray-400">
              {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedImages.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Select {selectedImages.length > 0 ? `(${selectedImages.length})` : ''}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGallery;