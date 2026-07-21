import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ArrowLeft, RotateCcw, CheckCircle2, XCircle, Brain } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import quizPattern from "@/assets/quiz-pattern.png";

type Question = {
  id: string;
  course: string;
  difficulty: "easy" | "medium" | "hard";
  min_age: number;
  max_age: number;
  question_ar: string;
  option_1_ar: string;
  option_2_ar: string;
  option_3_ar: string;
  option_4_ar: string;
  correct_option: number;
  explanation_ar: string | null;
};

const COURSES = [
  { value: "genius", label: "Genius — شهرين", desc: "أساسيات البرمجة للمبتدئين" },
  { value: "stars", label: "Stars of Tomorrow — 4 شهور", desc: "بناء مهارات متوسطة" },
  { value: "diploma", label: "Diploma — 6 شهور", desc: "دبلومة احترافية متقدمة" },
];

const LEVELS = ["easy", "medium", "hard"] as const;

const Quiz = () => {
  const { toast } = useToast();
  const [stage, setStage] = useState<"intake" | "quiz" | "result">("intake");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [asked, setAsked] = useState<Question[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [missStreak, setMissStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const MAX_QUESTIONS = 8;

  const pickNext = (
    pool: Question[],
    used: Question[],
    level: "easy" | "medium" | "hard",
    ageNum: number
  ): Question | null => {
    const filterFn = (q: Question) =>
      q.difficulty === level &&
      ageNum >= q.min_age &&
      ageNum <= q.max_age &&
      !used.some((u) => u.id === q.id);
    let candidates = pool.filter(filterFn);
    if (candidates.length === 0) {
      // fallback: same level any age
      candidates = pool.filter((q) => q.difficulty === level && !used.some((u) => u.id === q.id));
    }
    if (candidates.length === 0) {
      // fallback: any unused
      candidates = pool.filter((q) => !used.some((u) => u.id === q.id));
    }
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const startQuiz = async () => {
    const ageNum = parseInt(age);
    if (!name.trim() || !ageNum || !course) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "ادخل الاسم والسن والكورس" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("quiz_questions_public" as any)
      .select("*")
      .eq("course", course)
      .eq("is_visible", true);
    setLoading(false);
    if (error || !data || data.length === 0) {
      toast({ variant: "destructive", title: "لا توجد أسئلة", description: "لم يتم إضافة أسئلة لهذا الكورس بعد." });
      return;
    }
    const pool = data as Question[];
    setAllQuestions(pool);
    const first = pickNext(pool, [], "easy", ageNum);
    if (!first) {
      toast({ variant: "destructive", title: "لا توجد أسئلة مناسبة" });
      return;
    }
    setAsked([]);
    setCurrent(first);
    setCurrentLevel("easy");
    setScore(0);
    setStreak(0);
    setMissStreak(0);
    setAnswers([]);
    setAnswer("");
    setFeedback(null);
    setStage("quiz");
  };

  const submitAnswer = () => {
    if (!current || !answer) return;
    const chosen = parseInt(answer);
    const isCorrect = chosen === current.correct_option;
    const newScore = score + (isCorrect ? 1 : 0);
    const newStreak = isCorrect ? streak + 1 : 0;
    const newMiss = isCorrect ? 0 : missStreak + 1;
    const newAnswers = [
      ...answers,
      {
        q: current.question_ar,
        chosen,
        correct: current.correct_option,
        difficulty: current.difficulty,
        ok: isCorrect,
      },
    ];
    setAnswers(newAnswers);
    setScore(newScore);
    setStreak(newStreak);
    setMissStreak(newMiss);
    setFeedback({
      ok: isCorrect,
      text: isCorrect ? "إجابة صحيحة! 🎉" : `إجابة خاطئة. ${current.explanation_ar ?? ""}`,
    });

    // Adaptive level shift
    let nextLevel = currentLevel;
    if (newStreak >= 2 && currentLevel !== "hard") {
      nextLevel = currentLevel === "easy" ? "medium" : "hard";
    } else if (newMiss >= 2 && currentLevel !== "easy") {
      nextLevel = currentLevel === "hard" ? "medium" : "easy";
    }

    const newAsked = [...asked, current];
    setTimeout(() => {
      if (newAsked.length >= MAX_QUESTIONS) {
        finish(newScore, newAsked.length, nextLevel, newAnswers);
        return;
      }
      const ageNum = parseInt(age);
      const next = pickNext(allQuestions, newAsked, nextLevel, ageNum);
      if (!next) {
        finish(newScore, newAsked.length, nextLevel, newAnswers);
        return;
      }
      setAsked(newAsked);
      setCurrent(next);
      setCurrentLevel(nextLevel);
      setAnswer("");
      setFeedback(null);
      if (nextLevel !== currentLevel) {
        setStreak(0);
        setMissStreak(0);
      }
    }, 1400);
  };

  const finish = async (
    finalScore: number,
    total: number,
    finalLevel: string,
    finalAnswers: any[]
  ) => {
    const pct = (finalScore / total) * 100;
    let recommended = course;
    if (pct >= 80) {
      // upgrade
      if (course === "genius") recommended = "stars";
      else if (course === "stars") recommended = "diploma";
    } else if (pct < 40) {
      // downgrade
      if (course === "diploma") recommended = "stars";
      else if (course === "stars") recommended = "genius";
    }
    setCurrent(null);
    setStage("result");
    setScore(finalScore);
    setCurrentLevel(finalLevel as any);

    await supabase.from("quiz_attempts").insert({
      examinee_name: name,
      examinee_age: parseInt(age),
      chosen_course: course,
      recommended_course: recommended,
      final_level: finalLevel,
      score: finalScore,
      total_questions: total,
      answers: finalAnswers,
    });
  };

  const reset = () => {
    setStage("intake");
    setName("");
    setAge("");
    setCourse("");
  };

  const recommended = (() => {
    const pct = asked.length ? (score / asked.length) * 100 : 0;
    if (pct >= 80) {
      if (course === "genius") return "stars";
      if (course === "stars") return "diploma";
    } else if (pct < 40) {
      if (course === "diploma") return "stars";
      if (course === "stars") return "genius";
    }
    return course;
  })();
  const recCourse = COURSES.find((c) => c.value === recommended);
  const chosenCourse = COURSES.find((c) => c.value === course);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-amber-50 via-orange-50/40 to-background">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url(${quizPattern})`,
          backgroundSize: "320px auto",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
      <div className="relative">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">اختبار تحديد المستوى التكيفي</h1>
            <p className="text-muted-foreground text-sm">
              يتغير مستوى الأسئلة حسب إجاباتك — نوصيك بالكورس الأنسب لمستواك.
            </p>
          </div>
        </div>

        {stage === "intake" && (
          <Card className="p-6 space-y-5">
            <div className="space-y-2">
              <Label>اسم الممتحن</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أحمد محمد" />
            </div>
            <div className="space-y-2">
              <Label>السن</Label>
              <Input
                type="number"
                min={5}
                max={25}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="مثال: 10"
              />
            </div>
            <div className="space-y-2">
              <Label>الكورس المرغوب</Label>
              <div className="grid gap-3">
                {COURSES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCourse(c.value)}
                    className={`text-right p-4 rounded-lg border-2 transition-all ${
                      course === c.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="font-bold">{c.label}</div>
                    <div className="text-sm text-muted-foreground">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={startQuiz} disabled={loading} size="lg" className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <Sparkles className="w-4 h-4 ml-2" />
                  ابدأ الاختبار
                </>
              )}
            </Button>
          </Card>
        )}

        {stage === "quiz" && current && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Badge variant="outline">
                سؤال {asked.length + 1} / {MAX_QUESTIONS}
              </Badge>
              <Badge
                className={
                  currentLevel === "easy"
                    ? "bg-green-500"
                    : currentLevel === "medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }
              >
                مستوى:{" "}
                {currentLevel === "easy" ? "سهل" : currentLevel === "medium" ? "متوسط" : "صعب"}
              </Badge>
              <Badge variant="secondary">النقاط: {score}</Badge>
            </div>
            <Progress value={((asked.length) / MAX_QUESTIONS) * 100} />

            <h2 className="text-xl font-bold leading-relaxed">{current.question_ar}</h2>

            <RadioGroup value={answer} onValueChange={setAnswer} disabled={!!feedback}>
              {[1, 2, 3, 4].map((i) => {
                const text = (current as any)[`option_${i}_ar`];
                const isCorrect = feedback && i === current.correct_option;
                const isWrong = feedback && i === parseInt(answer) && i !== current.correct_option;
                return (
                  <Label
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                        : isWrong
                        ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                        : answer === String(i)
                        ? "border-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value={String(i)} />
                    <span className="flex-1">{text}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {isWrong && <XCircle className="w-5 h-5 text-red-600" />}
                  </Label>
                );
              })}
            </RadioGroup>

            {feedback && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  feedback.ok ? "bg-green-100 text-green-900 dark:bg-green-950/40 dark:text-green-200" : "bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <Button onClick={submitAnswer} disabled={!answer || !!feedback} size="lg" className="w-full">
              {feedback ? "السؤال التالي..." : "تأكيد الإجابة"}
            </Button>
          </Card>
        )}

        {stage === "result" && (
          <Card className="p-6 space-y-5 text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">انتهى الاختبار يا {name}!</h2>
            <div className="text-5xl font-black text-primary">
              {score} / {asked.length}
            </div>
            <p className="text-muted-foreground">
              نسبة النجاح: {Math.round((score / Math.max(asked.length, 1)) * 100)}% — المستوى النهائي:{" "}
              <span className="font-bold">
                {currentLevel === "easy" ? "مبتدئ" : currentLevel === "medium" ? "متوسط" : "متقدم"}
              </span>
            </p>

            <div className="bg-muted/40 rounded-lg p-4 text-right space-y-2">
              <p className="text-sm">
                <span className="font-bold">الكورس المختار:</span> {chosenCourse?.label}
              </p>
              <p className="text-sm">
                <span className="font-bold text-primary">الكورس الموصى به:</span>{" "}
                {recCourse?.label}
              </p>
              {recommended !== course && (
                <p className="text-xs text-muted-foreground">
                  بناءً على نتيجتك، نرى أن هذا الكورس أنسب لمستواك الحالي.
                </p>
              )}
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-4 h-4 ml-2" /> إعادة الاختبار
              </Button>
              <Link to="/booking">
                <Button>
                  <ArrowLeft className="w-4 h-4 ml-2" /> احجز الكورس الموصى به
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </main>
      <Footer />
      </div>
    </div>
  );
};

export default Quiz;
