import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Target, Compass, CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { StudentPersonalization, ShapeKey } from "@/data/studentPersonalization";

interface Props {
  studentName: string;
  personalization: StudentPersonalization;
}

/**
 * Unique geometric shape motif rendered behind the hero — every student
 * gets a different shape so their profile feels personal at a glance.
 */
const ShapeMotif: React.FC<{ shape: ShapeKey }> = ({ shape }) => {
  const common = "absolute -top-8 -left-8 w-56 h-56 opacity-20 pointer-events-none";
  switch (shape) {
    case "hexagon":
      return <svg className={common} viewBox="0 0 100 100" fill="white"><polygon points="50,3 95,25 95,75 50,97 5,75 5,25" /></svg>;
    case "diamond":
      return <svg className={common} viewBox="0 0 100 100" fill="white"><polygon points="50,5 95,50 50,95 5,50" /></svg>;
    case "triangle":
      return <svg className={common} viewBox="0 0 100 100" fill="white"><polygon points="50,10 95,90 5,90" /></svg>;
    case "square":
      return <svg className={common} viewBox="0 0 100 100" fill="white"><rect x="10" y="10" width="80" height="80" rx="8" /></svg>;
    case "star":
      return <svg className={common} viewBox="0 0 100 100" fill="white"><polygon points="50,5 61,38 96,38 68,59 79,92 50,72 21,92 32,59 4,38 39,38" /></svg>;
    case "wave":
      return <svg className={common} viewBox="0 0 100 100" fill="white"><path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" /></svg>;
    case "spark":
      return <svg className={common} viewBox="0 0 100 100" fill="white"><path d="M50,5 L58,42 L95,50 L58,58 L50,95 L42,58 L5,50 L42,42 Z" /></svg>;
    case "circle":
    default:
      return <svg className={common} viewBox="0 0 100 100" fill="white"><circle cx="50" cy="50" r="45" /></svg>;
  }
};

const PersonalizedInsightCard: React.FC<Props> = ({ studentName, personalization }) => {
  const { theme, shape, course, aiInsight, superpower, focusAreas, adaptivePath, nextMilestone, tags } = personalization;

  return (
    <div className="space-y-4 mb-6">
      {/* AI hero */}
      <div className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${theme.gradient} shadow-lg`}>
        <ShapeMotif shape={shape} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium opacity-90">لمحة ذكاء اصطناعي مخصصة لـ {studentName}</span>
          </div>
          <p className="text-lg leading-relaxed font-medium">{aiInsight}</p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">
                <span className="opacity-80">المسار:</span>{" "}
                <span className="font-bold">{course.title}</span>{" "}
                <span className="opacity-80">({course.duration})</span>
              </span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">
                <span className="opacity-80">القوة الخارقة:</span>{" "}
                <span className="font-bold">{superpower}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive learning path + focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className={`lg:col-span-2 border-2 ${theme.ring}`}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Compass className={`h-5 w-5 ${theme.text}`} />
              <h3 className="font-bold text-base">مسار التعلّم التكيفي</h3>
              <Badge variant="outline" className="mr-auto text-xs">مُعدَّل ذكيًا حسب أداء الطالب</Badge>
            </div>
            <ol className="space-y-3">
              {adaptivePath.map((stage, idx) => {
                const Icon = stage.status === "done" ? CheckCircle2 : stage.status === "current" ? Loader2 : Circle;
                const iconClass =
                  stage.status === "done" ? "text-green-500" :
                  stage.status === "current" ? `${theme.text} animate-pulse` :
                  "text-gray-300";
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${iconClass}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${stage.status === "upcoming" ? "text-muted-foreground" : ""}`}>
                          {stage.title}
                        </span>
                        {stage.status === "current" && (
                          <Badge className={`${theme.chip} text-xs border-0`}>الآن</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{stage.focus}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card className={`border-2 ${theme.ring}`}>
          <CardContent className="p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className={`h-4 w-4 ${theme.text}`} />
                <h4 className="font-bold text-sm">مناطق التركيز التكيفي</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((f, i) => (
                  <Badge key={i} className={`${theme.chip} border-0`}>{f}</Badge>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`h-4 w-4 ${theme.text}`} />
                <h4 className="font-bold text-sm">الهدف القادم</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{nextMilestone}</p>
            </div>

            {tags.length > 0 && (
              <div className="pt-3 border-t flex flex-wrap gap-1">
                {tags.map((t, i) => (
                  <Badge key={i} variant="outline" className="text-xs">#{t}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalizedInsightCard;
