import { ReactNode } from "react";
import { useSectionVisible } from "@/hooks/useSiteSections";

/**
 * Conditionally renders a homepage section based on admin visibility toggle.
 * Defaults to visible until data loads (no flash-of-removed-content).
 */
const SectionGate = ({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: ReactNode;
}) => {
  const visible = useSectionVisible(sectionKey);
  if (!visible) return null;
  return <>{children}</>;
};

export default SectionGate;
