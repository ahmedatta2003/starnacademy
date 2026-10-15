import { useEffect } from "react";
import Header from "@/components/Header";
import Team from "@/components/sections/Team";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AITutorChat from "@/components/AITutorChat";

const TeamPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28">
        <Team />
      </main>
      <Footer />
      <WhatsAppButton />
      <AITutorChat />
    </div>
  );
};

export default TeamPage;
