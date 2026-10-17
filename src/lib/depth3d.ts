// Lightweight site-wide 3D depth layer: pointer tilt on cards/images and a
// 3D reveal for sections. Pure CSS transforms — no backgrounds, order or colors change.
const CARD_SELECTOR =
  'main .card-playful, main [class*="rounded-2xl"][class*="border"], main [class*="rounded-3xl"], main .rounded-xl.border, footer [class*="rounded-2xl"]';
const SKIP_PATHS = ["/admin", "/dashboard", "/learn", "/auth", "/quiz"];
const MAX_TILT = 6;

const skip = () => SKIP_PATHS.some((p) => window.location.pathname.startsWith(p));

export function initDepth3D() {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer) {
    let active: HTMLElement | null = null;
    let frame = 0;
    const reset = (el: HTMLElement) => {
      el.style.transform = "";
      el.classList.remove("depth3d-active");
    };
    document.addEventListener(
      "pointermove",
      (e) => {
        if (skip()) return;
        const target = (e.target as HTMLElement | null)?.closest?.(CARD_SELECTOR) as HTMLElement | null;
        if (active && active !== target) reset(active);
        active = target;
        if (!target || target.closest("[data-no-tilt], [role=dialog], header")) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = target.getBoundingClientRect();
          if (r.width > 900) return; // keep large panels flat
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          target.classList.add("depth3d-active");
          target.style.transform = `perspective(900px) rotateX(${(-y * MAX_TILT).toFixed(2)}deg) rotateY(${(x * MAX_TILT).toFixed(2)}deg) translateZ(0) scale(1.015)`;
        });
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", () => active && reset(active));
  }

  // 3D entrance for sections
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("depth3d-in");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.08 },
  );
  const scan = () => {
    if (skip()) return;
    document.querySelectorAll("main section:not(.depth3d-seen)").forEach((s, i) => {
      s.classList.add("depth3d-seen");
      if (i === 0 && s.getBoundingClientRect().top < window.innerHeight) {
        s.classList.add("depth3d-in");
        return;
      }
      io.observe(s);
    });
  };
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();
}
