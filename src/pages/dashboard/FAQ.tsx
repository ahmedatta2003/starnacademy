import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "ما هي الأعمار المناسبة للالتحاق بالأكاديمية؟",
    answer: "نستقبل الأطفال من عمر 7 سنوات حتى 16 سنة. لدينا مستويات مختلفة تناسب كل الأعمار والمستويات."
  },
  {
    question: "هل يحتاج الطفل لخبرة سابقة في البرمجة؟",
    answer: "لا، نبدأ من الصفر ونعلم الأطفال أساسيات البرمجة بطريقة تفاعلية وممتعة."
  },
  {
    question: "ما هي مدة الدورات التدريبية؟",
    answer: "تختلف مدة الدورات حسب المستوى، وتتراوح بين 3 إلى 6 أشهر، بمعدل حصتين في الأسبوع."
  },
  {
    question: "هل يحصل الطفل على شهادة بعد إتمام الدورة؟",
    answer: "نعم، يحصل كل طالب على شهادة معتمدة من Starn Academy بعد إتمام الدورة بنجاح."
  },
  {
    question: "كيف يتم تقييم تقدم الطالب؟",
    answer: "نستخدم نظام الملصقات التحفيزي ونقدم تقارير شهرية مفصلة لأولياء الأمور عن تقدم أطفالهم."
  },
  {
    question: "ما هي لغات البرمجة التي يتم تدريسها؟",
    answer: "نقدم دورات في Scratch، Python، JavaScript، HTML/CSS، وتطوير الألعاب باستخدام Unity."
  },
  {
    question: "هل الدراسة أونلاين أم في مقر الأكاديمية؟",
    answer: "نوفر كلا الخيارين - دراسة حضورية في مقرنا بالزقازيق، أو دراسة أونلاين عبر الإنترنت."
  },
  {
    question: "كيف يمكن التواصل مع المدربين؟",
    answer: "يمكن التواصل عبر واتساب، المساعد الذكي في الموقع، أو خدمة العملاء."
  }
];

const DashboardFAQ = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الأسئلة الشائعة</h2>
        <p className="text-muted-foreground mt-2">
          إجابات على الأسئلة الأكثر شيوعاً من أولياء الأمور والطلاب
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أسئلة وأجوبة</CardTitle>
          <CardDescription>
            إذا لم تجد إجابة لسؤالك، لا تتردد في التواصل معنا
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-right text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardFAQ;
