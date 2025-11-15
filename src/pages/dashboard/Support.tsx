import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Headphones, Book, Video } from "lucide-react";

const Support = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">خدمة العملاء</h1>
        <p className="text-muted-foreground">نحن هنا لمساعدتك في أي وقت</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <MessageCircle className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">الدردشة المباشرة</CardTitle>
            <CardDescription>متاح الآن</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Headphones className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">الدعم الهاتفي</CardTitle>
            <CardDescription>9:00 ص - 6:00 م</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Book className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">قاعدة المعرفة</CardTitle>
            <CardDescription>مقالات وأدلة</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Video className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">فيديوهات تعليمية</CardTitle>
            <CardDescription>شروحات مرئية</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الأسئلة الشائعة</CardTitle>
          <CardDescription>إجابات سريعة على الأسئلة الأكثر شيوعاً</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>كيف يمكنني التسجيل في دورة جديدة؟</AccordionTrigger>
              <AccordionContent>
                يمكنك التسجيل في الدورات من خلال صفحة الدورات المتاحة. اختر الدورة المناسبة واضغط على زر "التسجيل الآن".
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>هل يمكنني تغيير موعد الحصة؟</AccordionTrigger>
              <AccordionContent>
                نعم، يمكنك تغيير موعد الحصة قبل 24 ساعة على الأقل من موعدها المحدد من خلال التواصل مع خدمة العملاء.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>كيف أتابع تقدم طفلي؟</AccordionTrigger>
              <AccordionContent>
                يمكنك متابعة تقدم طفلك من خلال لوحة التحكم الخاصة بك، حيث يتم عرض التقارير الدورية والإنجازات.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>ما هي سياسة الاسترجاع؟</AccordionTrigger>
              <AccordionContent>
                نوفر سياسة استرجاع مرنة خلال 7 أيام من تاريخ التسجيل إذا لم تبدأ الدورة بعد.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>لا تجد ما تبحث عنه؟</CardTitle>
          <CardDescription>تواصل معنا مباشرة وسنساعدك</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full md:w-auto">
            تواصل مع فريق الدعم
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
