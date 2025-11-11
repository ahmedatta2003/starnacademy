import certificateTemplate from "@/assets/certificate-template.jpg";

const Certificate = () => {
  return (
    <section id="certificate" className="py-20 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Certificate
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upon completing the course, each student receives a certified completion certificate
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative group animate-fade-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-turquoise to-purple rounded-lg blur-lg opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-background p-4 md:p-8 rounded-lg shadow-2xl">
              <img 
                src={certificateTemplate} 
                alt="Starn Academy Certificate of Completion - شهادة إتمام من أكاديمية ستارن" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-card rounded-lg shadow-md animate-fade-in">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">Certified</h3>
              <p className="text-muted-foreground">
                Official recognized certificate
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-bold mb-2">Professional Design</h3>
              <p className="text-muted-foreground">
                Beautiful design suitable for children
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl mb-3">📜</div>
              <h3 className="text-xl font-bold mb-2">Lasting Achievement</h3>
              <p className="text-muted-foreground">
                Document that proves acquired skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificate;
