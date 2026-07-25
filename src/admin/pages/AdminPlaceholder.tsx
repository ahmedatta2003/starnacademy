import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

const AdminPlaceholder = ({ title, phase }: { title: string; phase: number }) => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">Module scheduled for Phase {phase}.</p>
    </div>
    <Card className="p-10 flex flex-col items-center justify-center text-center gap-3 border-dashed">
      <Construction className="w-8 h-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground max-w-md">
        This module lands in Phase {phase} of the EduOS rollout. Phase 1 ships the foundation
        (auth, layout, dashboard, audit, feature flags).
      </p>
    </Card>
  </div>
);

export default AdminPlaceholder;
