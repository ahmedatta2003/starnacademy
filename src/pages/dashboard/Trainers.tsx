import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const trainers = [
  {
    id: 1,
    name: "أحمد محمد",
    specialization: ["Python", "JavaScript", "Scratch"],
    yearsOfExperience: 5,
    bio: "مدرب محترف في مجال البرمجة للأطفال مع خبرة واسعة في تطوير المناهج التعليمية",
    education: "بكالوريوس علوم الحاسب",
    certifications: ["مدرب معتمد من Microsoft", "خبير Scratch"],
    avatar: "",
  },
  {
    id: 2,
    name: "سارة أحمد",
    specialization: ["Web Development", "HTML", "CSS"],
    yearsOfExperience: 4,
    bio: "متخصصة في تعليم تطوير المواقع الإلكترونية بطريقة بسيطة وممتعة للأطفال",
    education: "بكالوريوس هندسة البرمجيات",
    certifications: ["مطور ويب معتمد", "مدرب Google"],
    avatar: "",
  },
  {
    id: 3,
    name: "محمد علي",
    specialization: ["Game Development", "Unity", "C#"],
    yearsOfExperience: 6,
    bio: "خبير في تطوير الألعاب وتعليم الأطفال كيفية إنشاء ألعابهم الخاصة",
    education: "ماجستير في تطوير الألعاب",
    certifications: ["Unity Certified Developer", "مدرب معتمد في تطوير الألعاب"],
    avatar: "",
  },
];

const Trainers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">المدربين</h2>
        <p className="text-muted-foreground mt-2">
          تعرف على فريق المدربين المحترفين في Starn Academy
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <Card key={trainer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={trainer.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {trainer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{trainer.name}</CardTitle>
                  <CardDescription>
                    {trainer.yearsOfExperience} سنوات خبرة
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {trainer.bio}
              </p>

              <div>
                <h4 className="text-sm font-semibold mb-2">التخصصات:</h4>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">المؤهل:</h4>
                <p className="text-sm text-muted-foreground">{trainer.education}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">الشهادات:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {trainer.certifications.map((cert) => (
                    <li key={cert} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Trainers;
