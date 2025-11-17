import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Sparkles, BookOpen, Code, Lightbulb } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "مرحباً! أنا مساعدك الذكي في أكاديمية ستارن. يمكنني مساعدتك في فهم البرمجة، حل المشاكل، وشرح المفاهيم. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    { icon: Code, text: "ما هي لغة Python؟", color: "text-blue-500" },
    { icon: Lightbulb, text: "كيف أبدأ في تعلم البرمجة؟", color: "text-yellow-500" },
    { icon: BookOpen, text: "ما هي أفضل الدورات للمبتدئين؟", color: "text-green-500" },
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // محاكاة رد الذكاء الاصطناعي
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("python")) {
      return "Python هي لغة برمجة عالية المستوى، سهلة التعلم وقوية. تُستخدم في تطوير الويب، تحليل البيانات، الذكاء الاصطناعي، والمزيد. في أكاديمية ستارن، نقدم دورات Python للمبتدئين تبدأ من الأساسيات وحتى المشاريع المتقدمة.";
    }

    if (lowerQuestion.includes("كيف أبدأ") || lowerQuestion.includes("البدء")) {
      return "للبدء في تعلم البرمجة، أنصحك بما يلي:\n\n1. ابدأ بدورة Scratch للأطفال إذا كنت مبتدئاً تماماً\n2. انتقل إلى Python للمبتدئين لتعلم لغة برمجة حقيقية\n3. مارس البرمجة يومياً ولو لمدة 30 دقيقة\n4. اصنع مشاريع صغيرة لتطبيق ما تعلمته\n\nهل تريد معرفة المزيد عن أي دورة محددة؟";
    }

    if (lowerQuestion.includes("دورات") || lowerQuestion.includes("كورسات")) {
      return "نقدم في أكاديمية ستارن عدة دورات مميزة:\n\n🎮 Scratch للأطفال - مثالية للمبتدئين\n🐍 Python للمبتدئين - تعلم البرمجة الحقيقية\n🎯 تطوير الألعاب - اصنع ألعابك الخاصة\n🌐 تطوير المواقع - بناء مواقع تفاعلية\n⚡ JavaScript المتقدم - للمستوى المتوسط\n\nأي دورة تهمك أكثر؟";
    }

    if (lowerQuestion.includes("شهادة") || lowerQuestion.includes("certificate")) {
      return "نعم! نقدم شهادات معتمدة عند إتمام كل دورة بنجاح. الشهادات تتضمن:\n\n✅ اسمك الكامل\n✅ اسم الدورة والمستوى\n✅ التقدير النهائي\n✅ ختم الأكاديمية\n\nيمكنك تحميل شهاداتك من صفحة الملف الشخصي.";
    }

    if (lowerQuestion.includes("ساعات") || lowerQuestion.includes("وقت") || lowerQuestion.includes("مدة")) {
      return "مدة الدورات تختلف حسب المستوى:\n\n⏰ دورات المبتدئين: 4-6 أسابيع\n⏰ دورات المتوسط: 6-8 أسابيع\n⏰ دورات المتقدم: 8-12 أسبوع\n\nنوفر جداول مرنة مع حصص 2-3 مرات أسبوعياً.";
    }

    if (lowerQuestion.includes("سعر") || lowerQuestion.includes("تكلفة") || lowerQuestion.includes("رسوم")) {
      return "للحصول على معلومات مفصلة عن أسعار الدورات والعروض الحالية، يمكنك:\n\n📞 التواصل معنا من صفحة \"تواصل معنا\"\n💬 التحدث مع خدمة العملاء\n📧 إرسال بريد إلكتروني\n\nلدينا عروض خاصة للطلاب والعائلات!";
    }

    // رد افتراضي
    return "شكراً على سؤالك! هذا سؤال رائع. في الوقت الحالي، أنا في مرحلة التطوير ويمكنني الإجابة على أسئلة محددة حول:\n\n• الدورات المتاحة\n• كيفية البدء في البرمجة\n• لغات البرمجة\n• الشهادات\n• أوقات الدورات\n\nهل لديك سؤال في أي من هذه المواضيع؟";
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>المساعد الذكي</CardTitle>
              <CardDescription>اسأل أي سؤال عن البرمجة والدورات</CardDescription>
            </div>
            <Badge variant="secondary" className="mr-auto gap-1">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        {quickQuestions.map((q, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="justify-start h-auto py-3 px-4 text-right hover:bg-muted"
            onClick={() => handleQuickQuestion(q.text)}
          >
            <q.icon className={`h-5 w-5 ml-2 ${q.color}`} />
            <span className="text-sm">{q.text}</span>
          </Button>
        ))}
      </div>

      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[80%] ${
                  message.role === "user" ? "text-left" : "text-right"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {message.timestamp.toLocaleTimeString("ar-SA", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك هنا..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            اضغط Enter للإرسال • المساعد الذكي يستخدم تقنيات AI متقدمة
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AITutor;
