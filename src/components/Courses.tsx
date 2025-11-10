import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BarChart } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      title: "Introduction to Scratch",
      age: "6-9 years",
      level: "Beginner",
      duration: "12 weeks",
      students: "150+",
      color: "turquoise",
      description: "Start coding journey with visual programming blocks"
    },
    {
      title: "Python for Kids",
      age: "10-13 years",
      level: "Beginner",
      duration: "16 weeks",
      students: "200+",
      color: "purple",
      description: "Learn Python basics through games and animations"
    },
    {
      title: "Web Development",
      age: "12-15 years",
      level: "Intermediate",
      duration: "20 weeks",
      students: "120+",
      color: "coral",
      description: "Build websites with HTML, CSS, and JavaScript"
    },
    {
      title: "Mobile App Development",
      age: "14-18 years",
      level: "Advanced",
      duration: "24 weeks",
      students: "80+",
      color: "golden",
      description: "Create mobile apps and publish to app stores"
    }
  ];

  return (
    <section id="courses" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Courses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured learning paths designed for every age group and skill level
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 flex flex-col"
            >
              <div 
                className="h-2 rounded-t-lg -mx-6 -mt-6 mb-6"
                style={{ backgroundColor: `hsl(var(--${course.color}))` }}
              />
              
              <div className="flex justify-between items-start mb-4">
                <Badge 
                  variant="secondary"
                  style={{ 
                    backgroundColor: `hsl(var(--${course.color}))`,
                    color: 'white'
                  }}
                >
                  {course.level}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">{course.age}</span>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-foreground">{course.title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{course.description}</p>

              <div className="space-y-3 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students} enrolled</span>
                </div>
              </div>

              <Button 
                className="w-full"
                style={{ backgroundColor: `hsl(var(--${course.color}))` }}
              >
                Learn More
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
