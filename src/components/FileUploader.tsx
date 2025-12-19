import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  label?: string;
  currentUrl?: string;
  folder?: string;
  type?: 'image' | 'video' | 'both';
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  accept = 'image/*,video/*',
  label = 'رفع ملف',
  currentUrl = '',
  folder = 'general',
  type = 'both'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptTypes = () => {
    switch (type) {
      case 'image':
        return 'image/jpeg,image/png,image/gif,image/webp';
      case 'video':
        return 'video/mp4,video/webm,video/quicktime';
      default:
        return 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime';
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (50MB max)
    if (file.size > 52428800) {
      toast.error('حجم الملف كبير جداً. الحد الأقصى 50MB');
      return;
    }

    setUploading(true);
    
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);
      toast.success('تم رفع الملف بنجاح');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'حدث خطأ في رفع الملف');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setPreview('');
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isVideo = preview && (preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov'));

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        {type === 'video' ? <Video className="h-4 w-4" /> : <Image className="h-4 w-4" />}
        {label}
      </Label>
      
      <div className="flex items-center gap-3">
        <Input
          ref={fileInputRef}
          type="file"
          accept={getAcceptTypes()}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={`file-upload-${folder}`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              جاري الرفع...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 ml-2" />
              اختر ملف
            </>
          )}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {preview && (
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          {isVideo ? (
            <video 
              src={preview} 
              controls 
              className="w-full max-h-48 object-cover"
            />
          ) : (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full max-h-48 object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
