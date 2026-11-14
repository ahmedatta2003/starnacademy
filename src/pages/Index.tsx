import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courses from "@/components/Courses";
import Benefits from "@/components/sections/Benefits";
import Team from "@/components/sections/Team";
import HomepagePromoCarousel from "@/components/sections/HomepagePromoCarousel";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AITutorChat from "@/components/AITutorChat";
import SectionGate from "@/components/SectionGate";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Header />

      <main>
        <HomepagePromoCarousel />
        <SectionGate sectionKey="about"><About /></SectionGate>
        <SectionGate sectionKey="courses"><Courses /></SectionGate>
        <SectionGate sectionKey="benefits"><Benefits /></SectionGate>
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
