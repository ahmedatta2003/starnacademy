import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Flag, AlertTriangle, ShieldAlert, Ban, MessageSquareWarning, HelpCircle } from 'lucide-react';

interface ReportContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'post' | 'comment' | 'message';
  contentId: string;
}

const reportReasons = [
  { value: 'inappropriate', label: 'محتوى غير لائق', icon: Ban, description: 'محتوى غير مناسب للأطفال' },
  { value: 'spam', label: 'إعلان مزعج', icon: MessageSquareWarning, description: 'رسائل متكررة أو إعلانات' },
  { value: 'harassment', label: 'تنمر أو إساءة', icon: ShieldAlert, description: 'سلوك مسيء أو تنمر' },
  { value: 'violence', label: 'عنف', icon: AlertTriangle, description: 'محتوى يحتوي على عنف' },
  { value: 'other', label: 'سبب آخر', icon: HelpCircle, description: 'أخبرنا بالتفاصيل' },
];

const ReportContentDialog = ({ isOpen, onClose, contentType, contentId }: ReportContentDialogProps) => {
  const { user } = useAuth();
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('الرجاء اختيار سبب الإبلاغ');
      return;
    }

    if (!user) {
      toast.error('يجب تسجيل الدخول للإبلاغ');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('content_reports')
        .insert({
          reporter_id: user.id,
          content_type: contentType,
          content_id: contentId,
          reason: reason,
          description: description.trim() || null,
        });

      if (error) throw error;

      toast.success('تم إرسال البلاغ بنجاح! شكراً لمساعدتك في الحفاظ على مجتمع آمن 🛡️');
      handleClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('حدث خطأ أثناء إرسال البلاغ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setDescription('');
    onClose();
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'post':
        return 'المنشور';
      case 'comment':
        return 'التعليق';
      case 'message':
        return 'الرسالة';
      default:
        return 'المحتوى';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Flag className="w-5 h-5" />
            الإبلاغ عن {getContentTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            ساعدنا في الحفاظ على مجتمع آمن وممتع للجميع 🌟
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-base font-semibold">لماذا تريد الإبلاغ عن هذا المحتوى؟</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
              {reportReasons.map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.value}
                    className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      reason === item.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => setReason(item.value)}
                  >
                    <RadioGroupItem value={item.value} id={item.value} className="sr-only" />
                    <Icon className={`w-5 h-5 ${reason === item.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                      <Label 
                        htmlFor={item.value} 
                        className="font-medium cursor-pointer"
                      >
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              تفاصيل إضافية (اختياري)
            </Label>
            <Textarea
              id="description"
              placeholder="أخبرنا بالمزيد عن سبب الإبلاغ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-left">{description.length}/500</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!reason || isSubmitting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                جاري الإرسال...
              </>
            ) : (
              <>
                <Flag className="w-4 h-4 ml-2" />
                إرسال البلاغ
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportContentDialog;
