import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  File, 
  AlertCircle,
  Loader2,
  Trash2,
  Download,
  Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { watermarkImage, WatermarkOptions } from '@/utils/imageWatermarker';
import { compressImage, CompressionOptions, formatFileSize as formatSize } from '@/utils/imageCompressor';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface ImageUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  bucket?: string;
  folder?: string;
  showPreview?: boolean;
  multiple?: boolean;
  className?: string;
  enableWatermark?: boolean;
  watermarkOptions?: WatermarkOptions;
  enableCompression?: boolean;
  compressionOptions?: CompressionOptions;
}

const ImageUpload = ({
  onUploadComplete,
  maxFiles = 5,
  maxFileSize = 10, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  bucket = 'images',
  folder = 'uploads',
  showPreview = true,
  multiple = true,
  enableWatermark = true,
  watermarkOptions = {
    text: '© DronelinkMW',
    position: 'bottom-right',
    opacity: 0.7,
    scale: 0.15,
    margin: 20
  },
  enableCompression = true,
  compressionOptions = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    format: 'webp',
    preserveOrientation: true
  },
  className
}: ImageUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<Record<string, { original: number; compressed: number; savings: number }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      setError(`File type ${file.type} is not allowed`);
      return false;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFiles: FileList) => {
    setError(null);
    const newFiles = Array.from(selectedFiles).filter(validateFile);

    if (!multiple) {
      setFiles(newFiles.slice(0, 1));
      return;
    }

    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    // Compress image first if enabled
    let fileToUpload = file;
    if (enableCompression && file.type.startsWith('image/')) {
      try {
        const result = await compressImage(file, compressionOptions);
        fileToUpload = result.file;
        
        if (result.wasCompressed) {
          setCompressionInfo(prev => ({
            ...prev,
            [file.name]: {
              original: result.originalSize,
              compressed: result.compressedSize,
              savings: result.savingsPercent
            }
          }));
        }
      } catch (compressError) {
        console.warn('Compression failed, using original file:', compressError);
      }
    }

    // Apply watermark if enabled and it's an image
    if (enableWatermark && fileToUpload.type.startsWith('image/')) {
      try {
        fileToUpload = await watermarkImage(fileToUpload, watermarkOptions);
      } catch (watermarkError) {
        console.warn('Watermark failed, uploading original file:', watermarkError);
      }
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Simulate progress for better UX
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
        .from(bucket)
        .upload(filePath, fileToUpload);

      clearInterval(progressInterval);
      
      if (error) throw error;

      // Set progress to 100%
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 100
      }));

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      const uploadedFile: UploadedFile = {
        id: data.id,
        name: file.name,
        url: publicUrlData.publicUrl,
        size: fileToUpload.size,
        type: fileToUpload.type,
        uploadedAt: new Date().toISOString()
      };

      return uploadedFile;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(uploadFile);
      const results = await Promise.all(uploadPromises);
      
      setUploadedFiles(prev => [...prev, ...results]);
      setFiles([]);
      setUploadProgress({});
      
      if (onUploadComplete) {
        onUploadComplete(results);
      }
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

  const removeUploadedFile = async (file: UploadedFile) => {
    try {
      // Extract file path from URL
      const urlParts = file.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      await supabase.storage
        .from(bucket)
        .remove([filePath]);

      setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
    } catch (err) {
      console.error('Error removing file:', err);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6 text-blue-400" />;
    }
    return <File className="h-6 w-6 text-gray-400" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              dragActive 
                ? "border-blue-400 bg-blue-400/10" 
                : "border-slate-600 hover:border-slate-500"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={acceptedTypes.join(',')}
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
            />

            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">
              {multiple ? 'Drop images here or click to browse' : 'Drop image here or click to browse'}
            </p>
            <p className="text-gray-400 text-sm">
              Maximum {maxFiles} files • {maxFileSize}MB each • {acceptedTypes.join(', ')}
            </p>
            {enableCompression && (
              <p className="text-green-400 text-xs mt-2">
                Auto-compression enabled: images will be optimized to save storage
              </p>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files to Upload */}
      {files.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Files to Upload ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file, index) => {
                const info = compressionInfo[file.name];
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="text-white text-sm font-medium">{file.name}</p>
                        <p className="text-gray-400 text-xs">
                          {formatFileSize(file.size)}
                          {info && (
                            <span className="text-green-400 ml-2">
                              → {formatSize(info.compressed)} ({info.savings}% saved)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadProgress[file.name] && (
                        <div className="w-20">
                          <Progress value={uploadProgress[file.name]} className="h-2" />
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Uploaded Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  {showPreview && file.type.startsWith('image/') ? (
                    <div className="aspect-video rounded-lg overflow-hidden bg-slate-700">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-slate-700 flex items-center justify-center">
                      <File className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">{file.name}</DialogTitle>
                        </DialogHeader>
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full rounded-lg"
                          />
                        ) : (
                          <div className="text-center py-8">
                            <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-300">{file.name}</p>
                            <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeUploadedFile(file)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-2">
                    <p className="text-white text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                      <Badge variant="outline" className="text-xs">
                        Uploaded
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;