import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bot, Loader2, MessageSquare, Send, Trash2 } from "lucide-react";

type Msg = { id?: string; role: "user" | "assistant"; content: string };

interface Props {
  lessonId: string;
  userId: string;
  lessonTitle: string;
  assignmentTitle?: string;
}

const LessonChat = ({ lessonId, userId, lessonTitle, assignmentTitle }: Props) => {
  const qc = useQueryClient();
  const key = ["learn", "lesson-chat", lessonId, userId];
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState<string | null>(null);
  const [pending, setPending] = useState<Msg | null>(null);
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_chat_messages" as any)
        .select("id, role, content")
        .eq("lesson_id", lessonId)
        .eq("student_id", userId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Msg[];
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length, streaming, pending]);

  const save = async (m: Msg) => {
    const { error } = await supabase
      .from("lesson_chat_messages" as any)
      .insert({ lesson_id: lessonId, student_id: userId, role: m.role, content: m.content });
    if (error) throw error;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setPending(userMsg);
    try {
      await save(userMsg);
      const { data: s } = await supabase.auth.getSession();
      const context = `سياق: الطالب يذاكر درس "${lessonTitle}"${assignmentTitle ? ` وعليه واجب "${assignmentTitle}"` : ""}. ساعده على الفهم ولا تحل الواجب كاملاً بدلاً منه؛ وجّهه بخطوات وتلميحات.`;
      const history = [...messages, userMsg].slice(-20).map(({ role, content }) => ({ role, content }));
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${s.session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: [{ role: "user", content: context }, ...history] }),
      });
      if (!resp.ok || !resp.body) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error ?? "تعذر الرد الآن");
      }
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let full = "";
      setStreaming("");
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
            if (delta) {
              full += delta;
              setStreaming(full);
            }
          } catch {
            /* partial line */
          }
        }
      }
      if (full) await save({ role: "assistant", content: full });
    } catch (e: any) {
      toast.error(e.message ?? "تعذر إرسال الرسالة");
    } finally {
      await qc.invalidateQueries({ queryKey: key });
      setPending(null);
      setStreaming(null);
      setBusy(false);
    }
  };

  const clear = async () => {
    const { error } = await supabase
      .from("lesson_chat_messages" as any)
      .delete()
      .eq("lesson_id", lessonId)
      .eq("student_id", userId);
    if (error) return toast.error("تعذر مسح المحادثة");
    qc.invalidateQueries({ queryKey: key });
  };

  const shown: Msg[] = [
    ...messages,
    ...(pending && !messages.some((m) => m.role === "user" && m.content === pending.content && !m.id) ? [pending] : []),
    ...(streaming !== null ? [{ role: "assistant" as const, content: streaming || "…" }] : []),
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          شات الدرس والواجب
        </CardTitle>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} disabled={busy}>
            <Trash2 className="w-4 h-4 ml-1" /> مسح
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">المحادثة دي محفوظة ليك إنت بس، وبترجع لما تفتح الدرس تاني.</p>
        <div className="max-h-96 overflow-y-auto space-y-3 rounded-lg border border-border/60 p-3 bg-muted/30">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          ) : shown.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-6">اسأل أي سؤال عن الدرس أو الواجب.</p>
          ) : (
            shown.map((m, i) =>
              m.role === "user" ? (
                <div key={m.id ?? `p${i}`} className="mr-auto max-w-[85%] rounded-2xl bg-primary text-primary-foreground px-3 py-2 text-sm whitespace-pre-wrap">
                  {m.content}
                </div>
              ) : (
                <div key={m.id ?? `s${i}`} className="flex gap-2 max-w-[95%]">
                  <Bot className="w-5 h-5 text-secondary shrink-0 mt-1" />
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                </div>
              )
            )
          )}
          <div ref={endRef} />
        </div>
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="اكتب سؤالك…"
            rows={2}
            maxLength={2000}
            className="resize-none"
          />
          <Button size="icon" onClick={send} disabled={busy || !input.trim()} aria-label="إرسال">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonChat;
