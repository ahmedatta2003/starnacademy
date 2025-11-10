import certificateTemplate from "@/assets/certificate-template.jpg";

const Certificate = () => {
  return (
    <section id="certificate" className="py-20 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Certificate | شهادتنا
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            عند إتمام الدورة، يحصل كل طالب على شهادة معتمدة تُثبت إنجازه
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              <h3 className="text-xl font-bold mb-2">معتمدة</h3>
              <p className="text-muted-foreground">
                شهادة رسمية معترف بها
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-bold mb-2">تصميم احترافي</h3>
              <p className="text-muted-foreground">
                تصميم مميز يناسب الأطفال
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl mb-3">📜</div>
              <h3 className="text-xl font-bold mb-2">إنجاز دائم</h3>
              <p className="text-muted-foreground">
                وثيقة تُثبت المهارات المكتسبة
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificate;
