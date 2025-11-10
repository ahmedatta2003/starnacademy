import { Card } from "@/components/ui/card";
import { Code2, Users, Rocket, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Code2,
      title: "Interactive Coding",
      description: "Learn through hands-on projects and real-world applications",
      color: "turquoise"
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from experienced programming professionals",
      color: "purple"
    },
    {
      icon: Rocket,
      title: "Future-Ready Skills",
      description: "Master technologies that matter in tomorrow's world",
      color: "coral"
    },
    {
      icon: Award,
      title: "Certified Programs",
      description: "Earn certificates as you progress through courses",
      color: "golden"
    }
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to Starn Academy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to empower the next generation with coding skills 
            that will shape their future. Our innovative curriculum makes learning 
            programming fun, engaging, and accessible for all ages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `hsl(var(--${feature.color}))` }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
