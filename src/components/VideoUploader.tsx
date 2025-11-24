import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Play, Pause, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface VideoUploaderProps {
  onUploadComplete: (videoData: { url: string; thumbnail: string }) => void;
  maxFileSize?: number;
  acceptFormats?: string[];
  className?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadComplete,
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  acceptFormats = ['video/mp4', 'video/mov', 'video/webm', 'video/avi'],
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const generateThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadeddata = () => {
        video.currentTime = 2; // Seek to 2 seconds for thumbnail
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailUrl);
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(videoFile);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => acceptFormats.includes(file.type));

    if (videoFile) {
      processVideoFile(videoFile);
    } else {
      setError('يرجى تحميل ملف فيديو صالح (MP4, MOV, WebM)');
    }
  }, [acceptFormats]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  }, []);

  const processVideoFile = async (file: File) => {
    setError(null);

    // Check file size
    if (file.size > maxFileSize) {
      setError(`حجم الملف كبير جدًا. الحد الأقصى هو ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return;
    }

    // Check file type
    if (!acceptFormats.includes(file.type)) {
      setError('نوع الملف غير مدعوم. يرجى استخدام MP4, MOV, أو WebM');
      return;
    }

    setSelectedFile(file);

    // Generate preview
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);

    // Generate thumbnail
    try {
      const thumbnailUrl = await generateThumbnail(file);
      setThumbnail(thumbnailUrl);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };

  const simulateUpload = async () => {
    if (!selectedFile || !thumbnail) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate upload progress
    const duration = 3000; // 3 seconds
    const steps = 30;
    const increment = 100 / steps;

    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, duration / steps));
      setUploadProgress(prev => Math.min(prev + increment, 100));
    }

    setIsUploading(false);

    // Simulate successful upload
    const mockVideoUrl = `https://mock-video-storage.com/videos/${Date.now()}.mp4`;
    const mockThumbnailUrl = thumbnail;

    onUploadComplete({
      url: mockVideoUrl,
      thumbnail: mockThumbnailUrl
    });

    // Reset state
    setSelectedFile(null);
    setVideoPreview(null);
    setThumbnail(null);
    setUploadProgress(0);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setThumbnail(null);
    setError(null);
    setUploadProgress(0);
    setIsPlaying(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      {!selectedFile && (
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
            'hover:border-primary hover:bg-primary/5',
            isDragging && 'border-primary bg-primary/10',
            isUploading && 'pointer-events-none opacity-50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptFormats.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-4">
            <Upload className="w-12 h-12 text-primary" />
            <div>
              <p className="text-lg font-semibold text-foreground">
                اسحب وأفلت الفيديو هنا أو انقر للاختيار
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                الصيغ المسموحة: {acceptFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')}
              </p>
              <p className="text-xs text-muted-foreground">
                الحد الأقصى للحجم: {Math.round(maxFileSize / 1024 / 1024)}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview */}
      {selectedFile && videoPreview && (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={videoPreview}
              className="w-full h-64 object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Controls */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-primary ml-1" />
                ) : (
                  <Play className="w-8 h-8 text-primary ml-1" />
                )}
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={removeFile}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* File Info */}
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(selectedFile.size / 1024 / 1024)}MB • {selectedFile.type.split('/')[1].toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {thumbnail && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">تم إنشاء المصغرة</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">جاري الرفع...</span>
                <span className="text-primary font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isUploading && (
            <div className="flex gap-3">
              <button
                onClick={simulateUpload}
                disabled={!thumbnail}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg font-medium transition-colors',
                  'bg-primary text-white hover:bg-primary/90',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                رفع الفيديو
              </button>
              <button
                onClick={removeFile}
                className="px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              >
                إلغاء
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;