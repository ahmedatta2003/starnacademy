import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courses from "@/components/Courses";
import Benefits from "@/components/sections/Benefits";
import Results from "@/components/sections/Results";
import ParentTestimonials from "@/components/ParentTestimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AITutorChat from "@/components/AITutorChat";
import SectionGate from "@/components/SectionGate";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <SectionGate sectionKey="hero"><Hero /></SectionGate>
        <SectionGate sectionKey="about"><About /></SectionGate>
        <SectionGate sectionKey="courses"><Courses /></SectionGate>
        <SectionGate sectionKey="benefits"><Benefits /></SectionGate>
        <SectionGate sectionKey="results"><Results /></SectionGate>
        <SectionGate sectionKey="testimonials"><ParentTestimonials /></SectionGate>
        <SectionGate sectionKey="faq"><FAQ /></SectionGate>
        <SectionGate sectionKey="contact"><Contact /></SectionGate>
      </main>

      <Footer />
      <WhatsAppButton />
      <AITutorChat />
    </div>
  );
};

export default Index;
