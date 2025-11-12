import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courses from "@/components/Courses";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import Certificate from "@/components/Certificate";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Courses />
      <WhyUs />
      <Contact />
      <Certificate />
      <FAQ />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
