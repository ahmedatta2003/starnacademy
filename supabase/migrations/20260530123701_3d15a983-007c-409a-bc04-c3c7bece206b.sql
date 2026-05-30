
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'easy',
  min_age INTEGER NOT NULL DEFAULT 6,
  max_age INTEGER NOT NULL DEFAULT 18,
  question_ar TEXT NOT NULL,
  question_en TEXT,
  option_1_ar TEXT NOT NULL,
  option_2_ar TEXT NOT NULL,
  option_3_ar TEXT NOT NULL,
  option_4_ar TEXT NOT NULL,
  option_1_en TEXT,
  option_2_en TEXT,
  option_3_en TEXT,
  option_4_en TEXT,
  correct_option INTEGER NOT NULL DEFAULT 1,
  explanation_ar TEXT,
  explanation_en TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quiz_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible questions"
  ON public.quiz_questions FOR SELECT
  USING (is_visible = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage quiz questions"
  ON public.quiz_questions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  examinee_name TEXT NOT NULL,
  examinee_age INTEGER NOT NULL,
  chosen_course TEXT NOT NULL,
  recommended_course TEXT,
  final_level TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  answers JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quiz_attempts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create attempts"
  ON public.quiz_attempts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view attempts"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage attempts"
  ON public.quiz_attempts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed a few sample questions per course
INSERT INTO public.quiz_questions (course, difficulty, min_age, max_age, question_ar, option_1_ar, option_2_ar, option_3_ar, option_4_ar, correct_option, explanation_ar, display_order) VALUES
('genius', 'easy', 6, 12, 'ما هو الأمر الذي يطبع كلمة على الشاشة في Python؟', 'print()', 'echo()', 'write()', 'say()', 1, 'في بايثون نستخدم print() لطباعة النصوص.', 1),
('genius', 'easy', 6, 12, 'ما هو الرمز المستخدم للجمع في البرمجة؟', '+', '-', '*', '/', 1, 'علامة + تُستخدم للجمع.', 2),
('genius', 'medium', 6, 12, 'ما الناتج: 5 + 3 * 2 ؟', '11', '16', '13', '10', 1, 'الضرب يُنفذ قبل الجمع: 3*2=6 ثم +5 = 11.', 3),
('stars', 'easy', 9, 15, 'أي من التالي ليس لغة برمجة؟', 'HTML', 'Python', 'JavaScript', 'C++', 1, 'HTML لغة ترميز وليست لغة برمجة.', 1),
('stars', 'medium', 9, 15, 'ما وظيفة الحلقة (Loop)؟', 'تكرار الأوامر', 'حذف البيانات', 'حفظ ملف', 'فتح موقع', 1, 'الحلقات تُستخدم لتكرار تنفيذ مجموعة من الأوامر.', 2),
('stars', 'hard', 9, 15, 'ما نوع المتغير في: x = "10" ؟', 'String', 'Integer', 'Float', 'Boolean', 1, 'الاقتباس يجعل القيمة نصية (String).', 3),
('diploma', 'medium', 12, 18, 'ما هي وظيفة الـ Function؟', 'تنفيذ كود قابل لإعادة الاستخدام', 'تخزين بيانات فقط', 'عرض صورة', 'لا شيء', 1, 'الـ Functions تُستخدم لتجميع كود يمكن استدعاؤه مراراً.', 1),
('diploma', 'hard', 12, 18, 'ما هو OOP؟', 'البرمجة الكائنية', 'نظام تشغيل', 'قاعدة بيانات', 'مكتبة', 1, 'OOP = Object Oriented Programming وهي البرمجة الكائنية.', 2),
('diploma', 'hard', 12, 18, 'ما الفرق بين let و const في JavaScript؟', 'const ثابتة لا تتغير', 'لا يوجد فرق', 'let للأرقام فقط', 'const للنصوص فقط', 1, 'const تُعرّف قيمة ثابتة لا يمكن إعادة إسنادها.', 3);
