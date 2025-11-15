import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "مرحباً! أنا مساعدك الذكي في تعلم البرمجة. كيف يمكنني مساعدتك اليوم؟",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: "شكراً على سؤالك! سأساعدك في فهم هذا الموضوع. هذه ميزة قيد التطوير وستكون متاحة قريباً.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">المساعد الذكي</h1>
        <p className="text-muted-foreground">اسأل واحصل على إجابات فورية حول البرمجة</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-full">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle>محادثة مع المساعد الذكي</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="اكتب سؤالك هنا..."
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">أمثلة على الأسئلة</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-right h-auto py-3"
                onClick={() => setInput("ما هي لغة Python؟")}
              >
                ما هي لغة Python؟
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-right h-auto py-3"
                onClick={() => setInput("كيف أبدأ في تعلم JavaScript؟")}
              >
                كيف أبدأ في تعلم JavaScript؟
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-right h-auto py-3"
                onClick={() => setInput("ما الفرق بين HTML و CSS؟")}
              >
                ما الفرق بين HTML و CSS؟
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-right h-auto py-3"
                onClick={() => setInput("اشرح لي مفهوم المتغيرات")}
              >
                اشرح لي مفهوم المتغيرات
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">نصائح للاستخدام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• اطرح أسئلة واضحة ومحددة</p>
              <p>• يمكنك طلب أمثلة عملية</p>
              <p>• المساعد يدعم اللغة العربية والإنجليزية</p>
              <p>• استخدمه لفهم المفاهيم البرمجية</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
