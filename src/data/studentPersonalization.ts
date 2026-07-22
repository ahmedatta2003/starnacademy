/**
 * Per-student personalization data.
 * Each student has a unique visual theme, adaptive learning path
 * (aligned to one of our 3 courses), an AI-crafted insight paragraph,
 * a superpower, focus areas, and a shape motif for the profile hero.
 *
 * This powers the customized profile cards on /student-profile/:studentId.
 */

export type CourseKey = "genius" | "stars" | "diploma";
export type ShapeKey = "hexagon" | "diamond" | "circle" | "triangle" | "star" | "square" | "wave" | "spark";

export interface AdaptiveStage {
  title: string;
  status: "done" | "current" | "upcoming";
  focus: string;
}

export interface StudentPersonalization {
  theme: {
    gradient: string;   // tailwind gradient classes for hero
    ring: string;       // tailwind ring/border accent
    chip: string;       // tailwind chip bg
    text: string;       // accent text color
  };
  shape: ShapeKey;
  course: {
    key: CourseKey;
    title: string;
    duration: string;
  };
  aiInsight: string;              // AI-generated personalized paragraph
  superpower: string;             // signature strength
  focusAreas: string[];           // adaptive focus, 2-3 items
  adaptivePath: AdaptiveStage[];  // 4 stages tailored per student
  nextMilestone: string;
  tags: string[];
}

const COURSE_MAP: Record<CourseKey, { title: string; duration: string }> = {
  genius: { title: "المبرمج الواعد", duration: "شهرين" },
  stars: { title: "نجوم الغد", duration: "٤ شهور" },
  diploma: { title: "الدبلومة المتكاملة", duration: "٦ شهور" },
};

const THEMES = {
  royal: { gradient: "from-blue-500 via-indigo-500 to-purple-600", ring: "ring-blue-300", chip: "bg-blue-50 text-blue-700", text: "text-blue-700" },
  sunset: { gradient: "from-orange-400 via-pink-500 to-rose-500", ring: "ring-orange-300", chip: "bg-orange-50 text-orange-700", text: "text-orange-700" },
  emerald: { gradient: "from-emerald-400 via-teal-500 to-cyan-600", ring: "ring-emerald-300", chip: "bg-emerald-50 text-emerald-700", text: "text-emerald-700" },
  amber: { gradient: "from-yellow-400 via-amber-500 to-orange-500", ring: "ring-amber-300", chip: "bg-amber-50 text-amber-700", text: "text-amber-700" },
  violet: { gradient: "from-violet-500 via-fuchsia-500 to-pink-500", ring: "ring-violet-300", chip: "bg-violet-50 text-violet-700", text: "text-violet-700" },
  ocean: { gradient: "from-sky-400 via-blue-500 to-indigo-600", ring: "ring-sky-300", chip: "bg-sky-50 text-sky-700", text: "text-sky-700" },
  coral: { gradient: "from-rose-400 via-red-400 to-orange-400", ring: "ring-rose-300", chip: "bg-rose-50 text-rose-700", text: "text-rose-700" },
  forest: { gradient: "from-green-500 via-emerald-500 to-teal-600", ring: "ring-green-300", chip: "bg-green-50 text-green-700", text: "text-green-700" },
} as const;

const build = (
  themeKey: keyof typeof THEMES,
  shape: ShapeKey,
  courseKey: CourseKey,
  data: Omit<StudentPersonalization, "theme" | "shape" | "course">
): StudentPersonalization => ({
  theme: THEMES[themeKey],
  shape,
  course: { key: courseKey, ...COURSE_MAP[courseKey] },
  ...data,
});

export const STUDENT_PERSONALIZATION: Record<string, StudentPersonalization> = {
  "1": build("royal", "hexagon", "stars", {
    aiInsight:
      "أياد يتعلم بأسلوب مرئي منطقي؛ يفكك المشكلة قبل ما يكتب أول سطر كود. لاحظنا إن أداءه في تحديات Scratch الشرطية أعلى بـ 32% من المتوسط، فرفعنا صعوبة تمارينه تلقائيًا لتشمل الحلقات المتداخلة.",
    superpower: "التفكير المنطقي وحل المشكلات",
    focusAreas: ["الحلقات المتداخلة", "التصحيح الذاتي (Debugging)"],
    adaptivePath: [
      { title: "أساسيات Scratch", status: "done", focus: "المتغيرات والأحداث" },
      { title: "المنطق الشرطي المتقدم", status: "done", focus: "if / else المتداخلة" },
      { title: "بناء لعبة تفاعلية", status: "current", focus: "الحركة والتصادم" },
      { title: "الانتقال إلى Python", status: "upcoming", focus: "الجمل الأساسية" },
    ],
    nextMilestone: "إطلاق أول لعبة كاملة من تصميمه خلال ٣ أسابيع",
    tags: ["Scratch", "منطق", "ألعاب"],
  }),
  "2": build("sunset", "diamond", "stars", {
    aiInsight:
      "مروان مُحرَّك بالشغف، بيتعلم أسرع لما التمرين على شكل لعبة. النظام التكيفي رصد إن دافعيته ترتفع 40% مع تحديات التصميم، فحوّلنا مساره لمشروع لعبة شخصية.",
    superpower: "الخيال الإبداعي في تصميم الألعاب",
    focusAreas: ["ميكانيكا اللعب", "تصميم المستويات"],
    adaptivePath: [
      { title: "التعرف على Scratch", status: "done", focus: "الشخصيات والمشاهد" },
      { title: "تصميم أول مستوى", status: "done", focus: "القواعد والنقاط" },
      { title: "لعبة متعددة المستويات", status: "current", focus: "الحفظ والانتقال" },
      { title: "نشر اللعبة", status: "upcoming", focus: "المشاركة والتقييم" },
    ],
    nextMilestone: "نشر لعبته الأولى على منصة الأكاديمية",
    tags: ["تصميم ألعاب", "إبداع"],
  }),
  "3": build("emerald", "circle", "stars", {
    aiInsight:
      "مالك عنده حس تحليلي مبكر؛ يسأل «ليه؟» قبل «إزاي؟». الاختبار التكيفي رفع مستواه لمرحلة C بعد ما حل 3 تحديات منطقية متتالية بدقة 95%.",
    superpower: "التحليل المنطقي العميق",
    focusAreas: ["الخوارزميات البسيطة", "التفكير الحسابي"],
    adaptivePath: [
      { title: "أساسيات البرمجة", status: "done", focus: "المدخلات والمخرجات" },
      { title: "الخوارزميات", status: "current", focus: "الترتيب والبحث" },
      { title: "مشروع تطبيقي", status: "upcoming", focus: "حل مشكلة حقيقية" },
      { title: "مقدمة الذكاء الاصطناعي", status: "upcoming", focus: "أنماط البيانات" },
    ],
    nextMilestone: "بناء خوارزمية تخمين رقم بالمنطق",
    tags: ["منطق", "خوارزميات"],
  }),
  "4": build("violet", "triangle", "genius", {
    aiInsight:
      "ردينا تتعلم بأسلوب بصري رقيق؛ ترتاح للرسومات المتحركة أكتر من الكود النصي. اخترنا لها مسار المبرمج الواعد ليبدأ بالقصص التفاعلية.",
    superpower: "الحس البصري والقصص التفاعلية",
    focusAreas: ["الرسوم المتحركة", "سرد القصص بالبرمجة"],
    adaptivePath: [
      { title: "Scratch Jr", status: "done", focus: "تحريك الشخصيات" },
      { title: "قصة تفاعلية أولى", status: "current", focus: "الحوارات والمشاهد" },
      { title: "Scratch الكامل", status: "upcoming", focus: "المتغيرات" },
      { title: "مشروع نهاية الكورس", status: "upcoming", focus: "قصة من اختيارها" },
    ],
    nextMilestone: "إنهاء قصتها التفاعلية الأولى",
    tags: ["قصص", "رسوم متحركة"],
  }),
  "5": build("coral", "star", "genius", {
    aiInsight:
      "ياسين أصغر سنًا لكن سرعة استيعابه ملحوظة. النظام التكيفي خفّض حجم الدرس ورفع تكرار التمارين القصيرة، فتحسّن تركيزه بنسبة 28%.",
    superpower: "السرعة في الاستيعاب البصري",
    focusAreas: ["الأوامر المتسلسلة", "الأنماط البسيطة"],
    adaptivePath: [
      { title: "Scratch Jr", status: "current", focus: "الأوامر الأساسية" },
      { title: "أول تحدي مصغّر", status: "upcoming", focus: "حركة الشخصية" },
      { title: "لعبة صغيرة", status: "upcoming", focus: "تجميع الأوامر" },
      { title: "شهادة المستوى الأول", status: "upcoming", focus: "مراجعة شاملة" },
    ],
    nextMilestone: "اجتياز أول تحدي مصغّر",
    tags: ["مبتدئ", "Scratch Jr"],
  }),
  "6": build("ocean", "wave", "genius", {
    aiInsight:
      "مريم دقيقة في التفاصيل وبتحب التنظيم؛ تمارينها الأنظف من حيث الترتيب. رفعنا لها مستوى التصميم بدل الأكواد الطويلة.",
    superpower: "الدقة والتنظيم البصري",
    focusAreas: ["تصميم الواجهات البسيطة", "الأنماط اللونية"],
    adaptivePath: [
      { title: "أساسيات البرمجة", status: "done", focus: "الأوامر" },
      { title: "تصميم واجهة", status: "current", focus: "الألوان والتناسق" },
      { title: "لعبة بأسلوبها", status: "upcoming", focus: "الهوية البصرية" },
      { title: "مشاركة المشروع", status: "upcoming", focus: "العرض" },
    ],
    nextMilestone: "تصميم واجهة أول تطبيق مصغّر",
    tags: ["تصميم", "دقة"],
  }),
  "7": build("amber", "spark", "genius", {
    aiInsight:
      "خالد يحب التحديات القصيرة والمكافآت الفورية. النظام التكيفي حوّل مساره لتحديات يومية بنقاط، فارتفع معدل حضوره لثلاثة أيام متتالية.",
    superpower: "المثابرة في التحديات القصيرة",
    focusAreas: ["حل التحديات اليومية", "الحلقات البسيطة"],
    adaptivePath: [
      { title: "Scratch أساسي", status: "done", focus: "الأوامر" },
      { title: "تحديات يومية", status: "current", focus: "الحلقات" },
      { title: "لعبة تنافسية", status: "upcoming", focus: "النقاط والمستويات" },
      { title: "الانتقال للمستوى B", status: "upcoming", focus: "المتغيرات" },
    ],
    nextMilestone: "إتمام سلسلة ٧ أيام متتالية",
    tags: ["تحديات", "مثابرة"],
  }),
  "8": build("forest", "hexagon", "genius", {
    aiInsight:
      "حبيبة قوية في المنطق الرياضي؛ نتائجها في تمارين الأنماط أعلى من المتوسط. النظام التكيفي أدخل لها تحديات المنطق مبكرًا.",
    superpower: "المنطق الرياضي",
    focusAreas: ["الأنماط العددية", "الجمل الشرطية"],
    adaptivePath: [
      { title: "أساسيات Scratch", status: "done", focus: "الأوامر" },
      { title: "تحديات المنطق", status: "current", focus: "الأنماط" },
      { title: "لعبة أرقام", status: "upcoming", focus: "المتغيرات" },
      { title: "الانتقال للمستوى B", status: "upcoming", focus: "الشروط" },
    ],
    nextMilestone: "بناء لعبة أرقام كاملة",
    tags: ["منطق رياضي"],
  }),
  "9": build("violet", "circle", "genius", {
    aiInsight:
      "محمد بدأ حديثًا؛ خطة الأسبوعين الأولى مصممة لبناء الثقة بدروس قصيرة جدًا مع تشجيع بصري متكرر.",
    superpower: "الفضول والاستكشاف",
    focusAreas: ["التعوّد على الواجهة", "الأوامر الأولى"],
    adaptivePath: [
      { title: "ترحيب واستكشاف", status: "current", focus: "التعرف على المنصة" },
      { title: "أول أمر", status: "upcoming", focus: "تحريك شخصية" },
      { title: "أول لعبة صغيرة", status: "upcoming", focus: "تجميع الأوامر" },
      { title: "شهادة الانطلاق", status: "upcoming", focus: "مراجعة" },
    ],
    nextMilestone: "تنفيذ أول أمر برمجي",
    tags: ["مبتدئ"],
  }),
  "10": build("coral", "diamond", "genius", {
    aiInsight:
      "محمد محمود يتعلم بسرعة مذهلة لعمره؛ فُتحت له تحديات المستوى A مبكرًا لأن دقته في التمارين وصلت 88%.",
    superpower: "الاستيعاب السريع",
    focusAreas: ["الأوامر المتقدمة لعمره", "التصميم البسيط"],
    adaptivePath: [
      { title: "Scratch Jr", status: "done", focus: "الأوامر" },
      { title: "تحديات مصغّرة", status: "current", focus: "الحركة" },
      { title: "لعبة قصيرة", status: "upcoming", focus: "التصادم" },
      { title: "شهادة المستوى", status: "upcoming", focus: "المراجعة" },
    ],
    nextMilestone: "إتمام أول لعبة قصيرة",
    tags: ["سريع التعلم"],
  }),
  "11": build("emerald", "triangle", "genius", {
    aiInsight:
      "عمر في مرحلة الاستكشاف؛ خطته تعتمد على اللعب أكثر من الشرح. النظام يقدم له تمرينًا واحدًا كل مرة لتفادي التشتت.",
    superpower: "الحماس والاندماج",
    focusAreas: ["التعرف على الأوامر", "الحركة الأساسية"],
    adaptivePath: [
      { title: "التعرف على المنصة", status: "current", focus: "الواجهة" },
      { title: "أول تمرين", status: "upcoming", focus: "تحريك شخصية" },
      { title: "أول مشروع", status: "upcoming", focus: "أمرين متتاليين" },
      { title: "شهادة البداية", status: "upcoming", focus: "مراجعة" },
    ],
    nextMilestone: "إتمام أول تمرين تفاعلي",
    tags: ["مبتدئ", "استكشاف"],
  }),
  "12": build("ocean", "square", "genius", {
    aiInsight:
      "حمزة يتعلم بأسلوب هادئ ومنظم؛ يحتاج تكرار الأمر مرتين قبل الانتقال. عدّلنا سرعة الدروس لتناسب إيقاعه.",
    superpower: "الهدوء والتركيز",
    focusAreas: ["التعرف على المنصة", "الأوامر الأولى"],
    adaptivePath: [
      { title: "ترحيب", status: "current", focus: "التعرف على الواجهة" },
      { title: "أول أمر", status: "upcoming", focus: "تحريك شخصية" },
      { title: "تجميع أوامر", status: "upcoming", focus: "التسلسل" },
      { title: "أول مشروع", status: "upcoming", focus: "مراجعة" },
    ],
    nextMilestone: "تنفيذ أول أمرين متتاليين",
    tags: ["هادئ", "منظم"],
  }),
  "13": build("amber", "star", "genius", {
    aiInsight:
      "سليم أصغر أعضاء الأكاديمية نشاطًا، لكنه أنجز 8 نجوم في شهر واحد. النظام التكيفي رفع صعوبة تمارين Scratch Jr لتشمل مستويين متتاليين.",
    superpower: "الموهبة المبكرة",
    focusAreas: ["Scratch Jr المتقدم", "الرسم البرمجي"],
    adaptivePath: [
      { title: "التعرف على Scratch Jr", status: "done", focus: "الأوامر" },
      { title: "لعبة مصغّرة", status: "done", focus: "الحركة" },
      { title: "قصة تفاعلية", status: "current", focus: "المشاهد" },
      { title: "شهادة المستوى", status: "upcoming", focus: "مراجعة شاملة" },
    ],
    nextMilestone: "إنهاء قصته التفاعلية الأولى",
    tags: ["موهبة مبكرة", "Scratch Jr"],
  }),
};

export const getPersonalization = (id: string): StudentPersonalization =>
  STUDENT_PERSONALIZATION[id] ?? STUDENT_PERSONALIZATION["1"];
