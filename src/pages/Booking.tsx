import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar, Clock, User, MapPin, School, Baby, Phone, Mail, Loader2, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const regions = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الطائف',
  'بريدة',
  'تبوك',
  'خميس مشيط',
  'أبها',
  'نجران',
  'جازان',
  'الأحساء',
  'القطيف',
  'حائل',
  'الجبيل',
  'ينبع',
  'أخرى'
];

const schoolTypes = [
  'مدارس حكومية',
  'مدارس أهلية',
  'مدارس عالمية',
  'تعليم منزلي'
];

const timeSlots = [
  'صباحي (9:00 - 12:00)',
  'ظهري (12:00 - 3:00)',
  'عصري (3:00 - 6:00)',
  'مسائي (6:00 - 9:00)'
];

const courses = [
  'أساسيات البرمجة للأطفال (6-8 سنوات)',
  'Scratch للمبتدئين (8-10 سنوات)',
  'Python للناشئين (10-12 سنة)',
  'تطوير الألعاب (12-15 سنة)',
  'تطوير الويب (13-16 سنة)',
  'الذكاء الاصطناعي للشباب (14-18 سنة)',
  'الروبوتات والأردوينو (10-16 سنة)'
];

const Booking = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    phone: '',
    email: '',
    region: '',
    childAge: '',
    schoolType: '',
    course: '',
    preferredTime: '',
    notes: ''
  });

  const [webhookUrl, setWebhookUrl] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.parentName || !formData.childName || !formData.phone || !formData.region || 
        !formData.childAge || !formData.schoolType || !formData.course || !formData.preferredTime) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      // Google Sheets webhook URL - will be configured
      const googleSheetsUrl = webhookUrl || localStorage.getItem('booking_webhook_url');
      
      if (!googleSheetsUrl) {
        // Store locally if no webhook configured
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push({
          ...formData,
          timestamp: new Date().toISOString(),
          id: Date.now().toString()
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        toast.success('تم حفظ الحجز بنجاح! سنتواصل معك قريباً');
        setSubmitted(true);
        return;
      }

      // Send to Google Sheets via webhook
      const response = await fetch(googleSheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentName: formData.parentName,
          childName: formData.childName,
          phone: formData.phone,
          email: formData.email,
          region: formData.region,
          childAge: formData.childAge,
          schoolType: formData.schoolType,
          course: formData.course,
          preferredTime: formData.preferredTime,
          notes: formData.notes,
          timestamp: new Date().toISOString()
        }),
      });

      toast.success('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً');
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('حدث خطأ في إرسال الحجز. يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">تم استلام طلب الحجز!</h2>
              <p className="text-muted-foreground mb-6">
                شكراً لك {formData.parentName}! سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الحجز وترتيب موعد الدورة.
              </p>
              <div className="bg-muted p-4 rounded-lg text-right mb-6">
                <p className="font-medium">تفاصيل الحجز:</p>
                <p className="text-sm text-muted-foreground">الطالب: {formData.childName}</p>
                <p className="text-sm text-muted-foreground">الدورة: {formData.course}</p>
                <p className="text-sm text-muted-foreground">الوقت المفضل: {formData.preferredTime}</p>
              </div>
              <Button onClick={() => window.location.href = '/'} className="w-full">
                العودة للصفحة الرئيسية
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5" dir="rtl">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            احجز مقعدك الآن
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ابدأ رحلة طفلك في عالم البرمجة مع أفضل المدربين المتخصصين
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  نموذج الحجز
                </CardTitle>
                <CardDescription>
                  املأ البيانات التالية وسنتواصل معك لتأكيد الحجز
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Parent Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      بيانات ولي الأمر
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="parentName">اسم ولي الأمر *</Label>
                        <Input
                          id="parentName"
                          placeholder="أدخل الاسم الكامل"
                          value={formData.parentName}
                          onChange={(e) => handleInputChange('parentName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الجوال *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="05xxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Child Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Baby className="h-4 w-4 text-primary" />
                      بيانات الطفل
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="childName">اسم الطفل *</Label>
                        <Input
                          id="childName"
                          placeholder="أدخل اسم الطفل"
                          value={formData.childName}
                          onChange={(e) => handleInputChange('childName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="childAge">عمر الطفل *</Label>
                        <Select
                          value={formData.childAge}
                          onValueChange={(value) => handleInputChange('childAge', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر العمر" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 13 }, (_, i) => i + 6).map((age) => (
                              <SelectItem key={age} value={age.toString()}>
                                {age} سنوات
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="region">المنطقة *</Label>
                        <Select
                          value={formData.region}
                          onValueChange={(value) => handleInputChange('region', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المنطقة" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schoolType">نوع المدرسة *</Label>
                        <Select
                          value={formData.schoolType}
                          onValueChange={(value) => handleInputChange('schoolType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع المدرسة" />
                          </SelectTrigger>
                          <SelectContent>
                            {schoolTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Course Selection */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <School className="h-4 w-4 text-primary" />
                      اختيار الدورة
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="course">الدورة المطلوبة *</Label>
                      <Select
                        value={formData.course}
                        onValueChange={(value) => handleInputChange('course', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الدورة" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime">الوقت المناسب *</Label>
                      <Select
                        value={formData.preferredTime}
                        onValueChange={(value) => handleInputChange('preferredTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوقت المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      placeholder="أي ملاحظات أو متطلبات خاصة..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Calendar className="ml-2 h-4 w-4" />
                        إرسال طلب الحجز
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Choose Us */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">لماذا ستارن؟</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">مدربون متخصصون</h4>
                    <p className="text-sm text-muted-foreground">خبراء في تعليم الأطفال</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">مناهج تفاعلية</h4>
                    <p className="text-sm text-muted-foreground">تعلم ممتع ومشوق</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">شهادات معتمدة</h4>
                    <p className="text-sm text-muted-foreground">شهادة إتمام لكل دورة</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">متابعة مستمرة</h4>
                    <p className="text-sm text-muted-foreground">تقارير دورية لولي الأمر</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تواصل معنا</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm" dir="ltr">+966 50 000 0000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">info@starn.academy</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">الرياض، المملكة العربية السعودية</span>
                </div>
              </CardContent>
            </Card>

            {/* Admin Section - Hidden for regular users */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">إعداد Google Sheets</CardTitle>
                <CardDescription>للمسؤولين فقط</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="webhook">رابط Webhook</Label>
                  <Input
                    id="webhook"
                    type="url"
                    placeholder="https://script.google.com/..."
                    value={webhookUrl}
                    onChange={(e) => {
                      setWebhookUrl(e.target.value);
                      localStorage.setItem('booking_webhook_url', e.target.value);
                    }}
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    أدخل رابط Google Apps Script Web App
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
