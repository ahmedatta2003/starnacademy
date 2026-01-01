import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courses from "@/components/Courses";
import WhyUs from "@/components/WhyUs";
import StudentShowcase from "@/components/StudentShowcase";
import StudentSuccess from "@/components/StudentSuccess";
import ParentTestimonials from "@/components/ParentTestimonials";
import ShowcaseProjects from "@/components/ShowcaseProjects";
import Contact from "@/components/Contact";
import Certificate from "@/components/Certificate";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AITutorChat from "@/components/AITutorChat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Courses />
      <StudentShowcase />
      <WhyUs />
      <StudentSuccess />
      <ParentTestimonials />
      <ShowcaseProjects />
      <Contact />
      <Certificate />
      <FAQ />
      <Footer />
      <WhatsAppButton />
      <AITutorChat />
    </div>
  );
};

export default Index;
