import { Square, Semicircle, SprocketStar } from "./shapes/ShapeElements";

const WhyUs = () => {
  const reasons = [
    {
      title: "Age-Appropriate Curriculum",
      description: "Tailored learning paths for every developmental stage from 6 to 18 years"
    },
    {
      title: "Small Class Sizes",
      description: "Maximum 10 students per class ensures personalized attention"
    },
    {
      title: "Project-Based Learning",
      description: "Build real projects and showcase your work in our student gallery"
    },
    {
      title: "Flexible Scheduling",
      description: "Weekend and weekday classes available to fit your family's schedule"
    },
    {
      title: "Industry-Standard Tools",
      description: "Learn with the same tools used by professional developers"
    },
    {
      title: "Progress Tracking",
      description: "Parents receive regular updates on student progress and achievements"
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <Square className="absolute top-10 left-10 w-12 h-12 opacity-20" color="turquoise" />
      <Semicircle className="absolute top-20 right-20 w-16 h-16 opacity-20" color="coral" />
      <SprocketStar className="absolute bottom-20 left-1/4 opacity-20" color="golden" />
      <Square className="absolute bottom-32 right-1/3 w-8 h-8 opacity-20" color="purple" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Choose Starn Academy?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            We're not just teaching code, we're building the innovators of tomorrow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-primary-foreground/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                  style={{ 
                    backgroundColor: `hsl(var(--${
                      index % 4 === 0 ? 'turquoise' : 
                      index % 4 === 1 ? 'purple' : 
                      index % 4 === 2 ? 'coral' : 'golden'
                    }))` 
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                  <p className="opacity-90">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
