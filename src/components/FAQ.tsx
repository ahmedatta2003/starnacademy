import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "ما هو السن المناسب لبدء تعلم البرمجة؟",
      answer: "يمكن للأطفال البدء في تعلم البرمجة من سن 6 سنوات. نقدم دورات مخصصة لكل فئة عمرية تتناسب مع قدراتهم الإدراكية والتعليمية."
    },
    {
      question: "هل يحتاج طفلي لخلفية سابقة في البرمجة؟",
      answer: "لا على الإطلاق! دوراتنا مصممة للمبتدئين تماماً. نبدأ من الأساسيات ونتدرج مع الطفل خطوة بخطوة حتى يصل لمستويات متقدمة."
    },
    {
      question: "كم مدة الدورة الواحدة؟",
      answer: "مدة الدورة الأساسية 3 أشهر بواقع جلستين أسبوعياً، كل جلسة ساعة ونصف. يمكن تعديل الجدول حسب احتياجات الطالب."
    },
    {
      question: "هل الدورات أونلاين أم حضورية؟",
      answer: "نوفر كلا الخيارين! يمكنك اختيار الحضور الفعلي في مقرنا أو الدراسة أونلاين من المنزل عبر منصة تفاعلية مع نفس جودة التعليم."
    },
    {
      question: "ما هي تكلفة الدورات؟",
      answer: "تبدأ أسعارنا من 1500 جنيه شهرياً مع توفر خصومات للتسجيل المبكر والإخوة. نقدم أيضاً خطط دفع مرنة لتناسب جميع الأسر."
    },
    {
      question: "هل يحصل الطفل على شهادة بعد إتمام الدورة؟",
      answer: "نعم، يحصل كل طالب على شهادة معتمدة من أكاديميتنا بعد إتمام الدورة بنجاح، بالإضافة إلى تقرير مفصل عن مستواه وإنجازاته."
    },
    {
      question: "ما هي لغات البرمجة التي سيتعلمها طفلي؟",
      answer: "نبدأ بلغات مرئية مثل Scratch للمبتدئين، ثم ننتقل إلى Python و JavaScript للمستويات المتقدمة، مع التركيز على بناء مشاريع عملية."
    },
    {
      question: "كيف يمكنني متابعة تقدم طفلي؟",
      answer: "نوفر تقارير دورية عن تقدم الطفل، بالإضافة إلى إمكانية التواصل المباشر مع المعلم عبر واتساب أو الهاتف لمتابعة مستواه وأدائه."
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30" id="faq">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" dir="rtl">
            الأسئلة الشائعة
          </h2>
          <p className="text-lg text-muted-foreground" dir="rtl">
            إجابات على أكثر الأسئلة التي يطرحها أولياء الأمور
          </p>
          <p className="text-sm text-muted-foreground/80 mt-2">
            Frequently Asked Questions
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-right hover:no-underline py-6" dir="rtl">
                <span className="font-semibold text-lg">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-right text-muted-foreground leading-relaxed pb-6" dir="rtl">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center p-8 bg-card rounded-xl shadow-sm border">
          <p className="text-lg font-semibold mb-2" dir="rtl">
            لديك سؤال آخر؟
          </p>
          <p className="text-muted-foreground mb-4" dir="rtl">
            لا تتردد في التواصل معنا عبر واتساب أو الهاتف
          </p>
          <a 
            href="https://wa.me/201234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg font-semibold transition-colors"
          >
            تواصل معنا الآن
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
