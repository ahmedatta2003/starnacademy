import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "../components/DataTable";
import { Loader2 } from "lucide-react";

const empty = {
  full_name: "",
  email: "",
  password: "",
  phone: "",
  date_of_birth: "",
  city: "",
  governorate: "",
  school_name: "",
  grade_level: "",
  bio: "",
};

const AdminStudentNew = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || form.password.length < 8) {
      toast({ title: "Missing data", description: "Name, email and a password of 8+ characters are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-create-student", { body: form });
    setSaving(false);
    if (error || (data as any)?.error) {
      toast({ title: "Could not create student", description: (data as any)?.error ?? error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Student created" });
    navigate(`/admin/students/${(data as any).id}`);
  };

  const field = (k: keyof typeof empty, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} className="h-9" />
    </div>
  );

  return (
    <div>
      <PageHeader title="New Student" subtitle="Creates a real, confirmed student account." />
      <Card className="p-5 max-w-3xl">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {field("full_name", "Full name *")}
            {field("email", "Email *", "email")}
            {field("password", "Temporary password * (8+ chars)", "text")}
            {field("phone", "Phone")}
            {field("date_of_birth", "Date of birth", "date")}
            {field("grade_level", "Grade level")}
            {field("school_name", "School")}
            {field("city", "City")}
            {field("governorate", "Governorate")}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Bio</Label>
            <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Create student
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/admin/students")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminStudentNew;
