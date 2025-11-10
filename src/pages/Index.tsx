import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courses from "@/components/Courses";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import Certificate from "@/components/Certificate";
import Footer from "@/components/Footer";

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
      <Footer />
    </div>
  );
};

export default Index;
