import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, GraduationCap, Briefcase, Wrench, Sparkles, HelpCircle } from "lucide-react";
import patternAsset from "@/assets/methodology-pattern.png.asset.json";

const Methodology = () => {
  const faqs = [
    {
      question: "كيف يتم تدريس مهارات Word و Excel للأطفال بطريقة ممتعة؟",
      answer:
        "بنحول كل مهارة لمهمة عملية شبيهة باللعب: الطفل بيعمل بحث مدرسي حقيقي على Word ويصممه بألوان وصور، وفي Excel بيبني جدول مصروفه الشخصي أو يحسب نقاط لعبة، وفي PowerPoint بيعمل عرض عن موضوعه المفضل (كرة، ألعاب، فضاء). كل درس مبني على مشروع صغير، فالطفل بيتعلم الأداة وهو بيستخدمها فعلاً مش بيحفظ أزرار.",
    },
    {
      question: "ما هي مشاريع الـ AI التي سينفذها الطلاب في مرحلة المستوى C؟",
      answer:
        "في مرحلة المستوى C، والتي تُعد الجزء المتقدم من الدبلومة المتكاملة (منهج الـ 6 شهور)، ينفذ الطلاب مجموعة من المشاريع التطبيقية التي تركز على تدريب النماذج والتعامل مع البيانات المعقدة:\n\n• تدريب نماذج توقع النتائج: تدريب نموذج شجرة القرار (Decision Trees) للتنبؤ بنتائج بناءً على معطيات سابقة.\n• مشاريع التعرف الذكي: تطبيقات عملية باستخدام التعرف على الصور (Image Recognition) أو النصوص (Text Recognition).\n• مشروع التخرج (Capstone): بناء نظام إدارة المدينة الذكية — مشروع جماعي يدمج بايثون مع الذكاء الاصطناعي لمهام متقدمة مثل التنبؤ بحركة المرور وحلول للمشكلات البيئية.\n\nالمشاريع دي مبنية على أساسيات تعلم الآلة (Machine Learning) وبتأهل الطالب لحل مشكلات واقعية.",
    },
    {
      question: "هل التعليم التكيفي يناسب كل الأعمار؟",
      answer:
        "أيوه، النظام بيتعرف على مستوى الطفل من أول جلسة وبيعدّل صعوبة الدروس وسرعتها سواء كان عمره 7 سنين أو 16. كل طفل بياخد رحلة مختلفة حتى لو كانوا في نفس الفصل.",
    },
    {
      question: "هل لازم الطفل يكمل الثلاث مراحل؟",
      answer:
        "لأ، كل مرحلة قائمة بذاتها ومخرجاتها واضحة. تقدر تبدأ بـ المبرمج الواعد (3 شهور) وتقيّم بعدها لو حابب تكمل المبتكر الصغير أو الدبلومة المتكاملة.",
    },
    {
      question: "إزاي بتتأكدوا إن الطفل بيتقدم فعلاً؟",
      answer:
        "بنرسل تقرير شهري مفصّل لولي الأمر فيه: المهارات المكتسبة، المشاريع المنفذة، نقاط التحفيز (Stickers)، وتوصيات للمذاكرة في البيت. كمان فيه تواصل مباشر مع المدرب على واتساب في أي وقت.",
    },
  ];

  const tracks = [
    {
      icon: Sparkles,
      title: "المبرمج الواعد",
      duration: "3 شهور",
      desc: "بيبدأ ببرمجة الألعاب البصرية (Scratch) عشان يفهم المنطق، وبعدها بيدخل في أساسيات لغة بايثون — لغة العصر.",
    },
    {
      icon: Brain,
      title: "المبتكر الصغير",
      duration: "4 شهور",
      desc: "كل اللي فات + شهر كامل بيتعلم فيه إزاي يستخدم الذكاء الاصطناعي كمساعد ليه وإزاي يبني نماذج ذكية بسيطة جاهزة.",
    },
    {
      icon: GraduationCap,
      title: "الدبلومة المتكاملة",
      duration: "6 شهور",
      desc: "للي عاوز يتقن اللعبة: تدريب نماذج الذكاء الاصطناعي بنفسه ومشروع تخرج ضخم (Capstone) يفتخر بيه قدام العالم.",
    },
  ];

  const skills = [
    "إدارة الوقت بأسلوب Time Blocking",
    "مهارات Word و Excel و PowerPoint باحترافية",
    "التفكير النقدي ومهارات البحث الذكي",
    "الأمن السيبراني وحماية البيانات",
    "بناء CV ومعرض أعمال (Portfolio)",
  ];

  return (
    <div className="min-h-screen flex flex-col relative" dir="rtl">
      {/* Repeating geometric pattern background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url(${patternAsset.url})`,
          backgroundRepeat: "repeat",
          backgroundSize: "320px 320px",
        }}
      />
      <div className="relative z-10 flex flex-col flex-1">
      <Header />

      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero */}
          <section className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">حول منهجنا</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              يا أهلاً بكل أب وأم مهتمين بمستقبل ولادهم.. كلنا عارفين إن الدنيا بتتغير بسرعة،
              وإن "لغة المستقبل" هي البرمجة والذكاء الاصطناعي. عشان كده، صممنا منهج مش بس بيعلم
              "كود"، لكن بيبني شخصية طفلك ويحضره لسوق العمل وهو لسه بيدرس.
            </p>
          </section>

          {/* Adaptive Learning */}
          <Card className="mb-10 border-primary/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="w-7 h-7 text-primary" />
                <CardTitle className="text-2xl">منهج "بيفهم" طفلك — التعليم التكيفي</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed text-base">
              ميزتنا الكبيرة هي تقنية التعليم التكيفي. تخيل إن فيه "مدرس خصوصي ذكي" قاعد مع طفلك،
              لو لقاه شاطر في نقطة بيسرّع له المنهج، ولو لقاه تعثّر في حاجة بيعيدها له بطريقة أسهل
              ويقدم له مساعدة فورية. النظام بيحلّل مستوى طفلك ويعدّل الدروس عشان تناسب سرعته
              واهتماماته، فمستحيل طفل يزهق أو يحس إنه مش فاهم.
            </CardContent>
          </Card>

          {/* Tracks */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-primary" />
              المسارات التعليمية
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {tracks.map((t, i) => (
                <Card key={i} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <t.icon className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-xl">{t.title}</CardTitle>
                    <p className="text-sm text-primary font-semibold">{t.duration}</p>
                  </CardHeader>
                  <CardContent className="text-muted-foreground leading-relaxed">
                    {t.desc}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Career Skills */}
          <Card className="mb-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Briefcase className="w-7 h-7 text-primary" />
                <CardTitle className="text-2xl">مهارات مش هتلاقيها في مكان تاني</CardTitle>
              </div>
              <p className="text-muted-foreground mt-2">
                ورش عمل قصيرة وممتعة بتجهّز طفلك "مهنياً" من صغره:
              </p>
            </CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-3">
                {skills.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary text-xl leading-6">•</span>
                    <span className="text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How we teach */}
          <Card className="mb-14">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Wrench className="w-7 h-7 text-primary" />
                <CardTitle className="text-2xl">إزاي بنعلمهم؟ — أسلوبنا العملي</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              التعليم عندنا مش دش وكلام نظري؛ إحنا بنستخدم الأمثلة والتشبيهات (زي تشبيه الكمبيوتر
              بجسم الإنسان) عشان المعلومة تثبت. طفلك هيبني مشروعات حقيقية — ألعاب، تطبيقات،
              وأنظمة ذكية لمدن مستقبلية — مع زمايله في فريق واحد، وده بيعلمهم العمل الجماعي
              والتواصل.
              <p className="mt-4 font-semibold text-foreground">
                باختصار: طفلك معانا مش بس هيتعلم يبرمج، طفلك هيتعلم "إزاي يتعلم" ويكون متميز
                وواثق في نفسه في عالم التكنولوجيا.
              </p>
              <p className="mt-2 font-bold text-primary text-lg">
                ابنك هو مبدع المستقبل.. خلينا نساعده يبدأ صح!
              </p>
            </CardContent>
          </Card>

          {/* FAQ */}
          <section>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <HelpCircle className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">أسئلة شائعة حول المنهج</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border rounded-lg px-6 bg-card shadow-sm"
                >
                  <AccordionTrigger className="text-right hover:no-underline py-5">
                    <span className="font-semibold text-lg">{f.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-right text-muted-foreground leading-relaxed pb-5 whitespace-pre-line">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Methodology;
