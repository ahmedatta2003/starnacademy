import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Gift, CalendarDays, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import starnLogo from "@/assets/starn-logo.png";
import heroImage from "@/assets/free-session-hero.jpg";

const FreeSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    parentEmail: "",
    parentPhone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.childName || !formData.childAge || !formData.parentEmail || !formData.parentPhone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Save to Supabase database
      const { error } = await supabase
        .from('free_session_bookings')
        .insert({
          child_name: formData.childName,
          child_age: parseInt(formData.childAge),
          parent_email: formData.parentEmail,
          parent_phone: formData.parentPhone,
          status: 'pending'
        });
      
      if (error) throw error;
      
      setSubmitted(true);
      toast({
        title: "تم الحجز بنجاح! 🎉",
        description: "سنتواصل معك قريباً لتأكيد موعد الحصة المجانية",
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center animate-scale-in">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-2" dir="rtl">
              <h2 className="text-2xl font-bold text-foreground">تم الحجز بنجاح! 🎉</h2>
              <p className="text-muted-foreground">
                شكراً لك! سنتواصل معك قريباً على الرقم المسجل لتأكيد موعد الحصة المجانية.
              </p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg" dir="rtl">
              <p className="text-sm text-foreground">
                <strong>اسم الطفل:</strong> {formData.childName}<br />
                <strong>العمر:</strong> {formData.childAge} سنة<br />
                <strong>رقم التواصل:</strong> {formData.parentPhone}
              </p>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity">
          <ArrowRight className="w-5 h-5" />
          <span>العودة</span>
        </Link>
        <Link to="/">
          <img src={starnLogo} alt="Starn Academy" className="h-12 hover:scale-105 transition-transform" />
        </Link>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Form Section */}
          <Card className="order-2 lg:order-1 animate-fade-in shadow-2xl">
            <CardHeader className="text-center" dir="rtl">
              <div className="w-16 h-16 mx-auto bg-golden/20 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-golden" />
              </div>
              <CardTitle className="text-2xl">احجز حصتك المجانية</CardTitle>
              <CardDescription className="text-base">
                املأ البيانات التالية وسنتواصل معك لتأكيد الحجز
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
                <div className="space-y-2">
                  <Label htmlFor="childName">اسم الطفل *</Label>
                  <Input
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم الطفل"
                    className="text-right"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="childAge">عمر الطفل (بالسنوات) *</Label>
                  <Input
                    id="childAge"
                    name="childAge"
                    type="number"
                    min="6"
                    max="18"
                    value={formData.childAge}
                    onChange={handleInputChange}
                    placeholder="مثال: 10"
                    className="text-right"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">البريد الإلكتروني *</Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="text-left"
                    dir="ltr"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">رقم الهاتف *</Label>
                  <Input
                    id="parentPhone"
                    name="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    placeholder="01xxxxxxxxx"
                    className="text-left"
                    dir="ltr"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                  {loading ? "جاري الحجز..." : "احجز الآن مجاناً"}
                  <Sparkles className="w-5 h-5 mr-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Image & Info Section */}
          <div className="order-1 lg:order-2 space-y-6 animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="أطفال يتعلمون البرمجة" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
            
            {/* Info Cards */}
            <div className="grid gap-4" dir="rtl">
              <div className="flex items-center gap-4 p-4 bg-primary-foreground/10 backdrop-blur rounded-xl">
                <div className="p-3 rounded-full bg-golden/20">
                  <CalendarDays className="w-6 h-6 text-golden" />
                </div>
                <div className="text-primary-foreground">
                  <p className="font-bold">موعد الحصة المجانية</p>
                  <p className="text-sm opacity-80">يوم 1 من كل شهر</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-primary-foreground/10 backdrop-blur rounded-xl">
                <div className="p-3 rounded-full bg-coral/20">
                  <Users className="w-6 h-6 text-coral" />
                </div>
                <div className="text-primary-foreground">
                  <p className="font-bold">الأعداد محدودة</p>
                  <p className="text-sm opacity-80">سجل الآن لضمان مكان لطفلك</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-primary-foreground/10 backdrop-blur rounded-xl">
                <div className="p-3 rounded-full bg-turquoise/20">
                  <Sparkles className="w-6 h-6 text-turquoise" />
                </div>
                <div className="text-primary-foreground">
                  <p className="font-bold">تجربة تفاعلية مميزة</p>
                  <p className="text-sm opacity-80">مع مدربين محترفين ومناهج عالمية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeSession;