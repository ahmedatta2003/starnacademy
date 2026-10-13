import { useEffect } from "react";
import Header from "@/components/Header";
import StudentShowcase from "@/components/StudentShowcase";
import Results from "@/components/sections/Results";
import ParentTestimonials from "@/components/ParentTestimonials";
import Downloads from "@/components/sections/Downloads";
import VideoShowcase from "@/components/sections/VideoShowcase";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AITutorChat from "@/components/AITutorChat";
import SectionGate from "@/components/SectionGate";

const AcademyStars = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28">
        <SectionGate sectionKey="video"><VideoShowcase /></SectionGate>
        <SectionGate sectionKey="students"><StudentShowcase /></SectionGate>
        <SectionGate sectionKey="results"><Results /></SectionGate>
        <SectionGate sectionKey="testimonials"><ParentTestimonials /></SectionGate>
        <SectionGate sectionKey="downloads"><Downloads /></SectionGate>
      </main>
      <Footer />
      <WhatsAppButton />
      <AITutorChat />
    </div>
  );
};

export default AcademyStars;