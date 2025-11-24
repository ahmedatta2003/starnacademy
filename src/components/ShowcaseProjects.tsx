import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from '@/components/ProjectCard';
import {
  Code,
  Gamepad2,
  Globe,
  Smartphone,
  Film,
  Lightbulb,
  Star,
  ExternalLink,
  Users,
  Filter,
  Eye,
  Heart,
  Share2,
  Clock,
  Target
} from 'lucide-react';

interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  project_url?: string;
  project_type: 'game' | 'website' | 'app' | 'animation' | 'other';
  screenshot?: string;
  demo_url?: string;
  student_name: string;
  student_age: number;
  student_level: number;
  student_avatar?: string;
  instructor_rating: number;
  completion_date: string;
  technologies: string[];
  featured: boolean;
  views: number;
  likes: number;
}

const ShowcaseProjects: React.FC = () => {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ShowcaseProject[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [loading, setLoading] = useState(true);

  // Mock data for development - replace with actual API calls
  const mockProjects: ShowcaseProject[] = [
    {
      id: '1',
      title: 'مغامرة الفضاء',
      description: 'لعبة تعليمية ممتعة تستكشف الفضاء الخارجي وتعلم الأطفال عن الكواكب والنجوم',
      project_url: 'https://example.com/space-adventure',
      project_type: 'game',
      screenshot: '/api/placeholder/400/300',
      demo_url: 'https://demo.example.com/space-adventure',
      student_name: 'أحمد محمد',
      student_age: 12,
      student_level: 7,
      student_avatar: '/api/placeholder/50/50',
      instructor_rating: 5,
      completion_date: '2024-01-15',
      technologies: ['JavaScript', 'HTML5 Canvas', 'Phaser.js'],
      featured: true,
      views: 1250,
      likes: 89
    },
    {
      id: '2',
      title: 'موقع المدرسة التفاعلي',
      description: 'موقع ويب احترافي للمدرسة مع نظام إدارة المحتوى والجدول الدراسي',
      project_url: 'https://example.com/school-website',
      project_type: 'website',
      screenshot: '/api/placeholder/400/300',
      demo_url: 'https://demo.example.com/school-website',
      student_name: 'فاطمة العلي',
      student_age: 14,
      student_level: 8,
      student_avatar: '/api/placeholder/50/50',
      instructor_rating: 5,
      completion_date: '2024-01-12',
      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      featured: true,
      views: 980,
      likes: 76
    },
    {
      id: '3',
      title: 'تطبيق المهام الذكي',
      description: 'تطبيق موبايل لإدارة المهام والتذكيرات مع واجهة سهلة الاستخدام',
      project_url: 'https://example.com/task-app',
      project_type: 'app',
      screenshot: '/api/placeholder/400/300',
      demo_url: 'https://demo.example.com/task-app',
      student_name: 'عبدالله خالد',
      student_age: 15,
      student_level: 9,
      student_avatar: '/api/placeholder/50/50',
      instructor_rating: 4,
      completion_date: '2024-01-10',
      technologies: ['React Native', 'Firebase', 'Redux'],
      featured: false,
      views: 750,
      likes: 62
    },
    {
      id: '4',
      title: 'حكاية الأبطال',
      description: 'رسوم متحركة تعليمية عن القيم والأخلاق للأطفال',
      project_type: 'animation',
      screenshot: '/api/placeholder/400/300',
      demo_url: 'https://demo.example.com/heroes-animation',
      student_name: 'مريم سعد',
      student_age: 11,
      student_level: 6,
      student_avatar: '/api/placeholder/50/50',
      instructor_rating: 5,
      completion_date: '2024-01-08',
      technologies: ['Scratch', 'Adobe Animate', 'Audio Editing'],
      featured: true,
      views: 1100,
      likes: 95
    },
    {
      id: '5',
      title: 'آلة حاسبة متطورة',
      description: 'آلة حاسبة ذكية مع تاريخ العمليات الحسابية ورسوم بيانية',
      project_url: 'https://example.com/smart-calculator',
      project_type: 'other',
      screenshot: '/api/placeholder/400/300',
      demo_url: 'https://demo.example.com/smart-calculator',
      student_name: 'خالد أحمد',
      student_age: 13,
      student_level: 5,
      student_avatar: '/api/placeholder/50/50',
      instructor_rating: 4,
      completion_date: '2024-01-05',
      technologies: ['Python', 'Tkinter', 'Matplotlib'],
      featured: false,
      views: 620,
      likes: 48
    },
    {
      id: '6',
      title: 'سباق السيارات',
      description: 'لعبة سباق سيارات ثلاثية الأبعاد مع مستويات مختلفة وتحديات مثيرة',
      project_url: 'https://example.com/car-racing',
      project_type: 'game',
      screenshot: '/api/placeholder/400/300',
      demo_url: 'https://demo.example.com/car-racing',
      student_name: 'نورا علي',
      student_age: 12,
      student_level: 7,
      student_avatar: '/api/placeholder/50/50',
      instructor_rating: 5,
      completion_date: '2024-01-03',
      technologies: ['Unity', 'C#', 'Blender'],
      featured: true,
      views: 1580,
      likes: 112
    }
  ];

  const projectTypeStats = {
    game: { count: 0, icon: Gamepad2, color: 'purple', label: 'ألعاب' },
    website: { count: 0, icon: Globe, color: 'blue', label: 'مواقع' },
    app: { count: 0, icon: Smartphone, color: 'green', label: 'تطبيقات' },
    animation: { count: 0, icon: Film, color: 'orange', label: 'رسوم متحركة' },
    other: { count: 0, icon: Lightbulb, color: 'gray', label: 'أخرى' }
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by project type
    if (projectFilter !== 'all') {
      filtered = filtered.filter(project => project.project_type === projectFilter);
    }

    // Sort projects
    switch (sortBy) {
      case 'featured':
        filtered = filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.instructor_rating - a.instructor_rating);
        break;
      case 'views':
        filtered = filtered.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime());
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
  }, [projects, projectFilter, sortBy]);

  // Calculate project type stats
  const stats = { ...projectTypeStats };
  projects.forEach(project => {
    if (stats[project.project_type]) {
      stats[project.project_type].count++;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectTypeIcon = (type: string) => {
    const iconMap = {
      game: Gamepad2,
      website: Globe,
      app: Smartphone,
      animation: Film,
      other: Lightbulb
    };
    return iconMap[type as keyof typeof iconMap] || Lightbulb;
  };

  const handleProjectClick = (project: ShowcaseProject) => {
    if (project.project_url) {
      window.open(project.project_url, '_blank');
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold text-gradient-primary">جاري تحميل المشاريع المتميزة...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient-fun mb-4">
            مشاريع طلابية متميزة
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            استكشف إبداعات طلابنا ومشاريعهم البرمجية التي تعكس مهاراتهم الإبداعية
          </p>
        </div>

        {/* Project Categories Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {Object.entries(stats).map(([type, stat]) => {
            const Icon = stat.icon;
            return (
              <Card
                key={type}
                className={`text-center p-4 cursor-pointer hover-lift ${
                  projectFilter === type ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setProjectFilter(projectFilter === type ? 'all' : type)}
              >
                <div className={`text-${stat.color}-500 mb-2`}>
                  <Icon className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="نوع المشروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المشاريع</SelectItem>
                <SelectItem value="game">ألعاب</SelectItem>
                <SelectItem value="website">مواقع</SelectItem>
                <SelectItem value="app">تطبيقات</SelectItem>
                <SelectItem value="animation">رسوم متحركة</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <Target className="h-4 w-4 mr-2" />
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">المميزة أولاً</SelectItem>
                <SelectItem value="rating">التقييم الأعلى</SelectItem>
                <SelectItem value="views">الأكثر مشاهدة</SelectItem>
                <SelectItem value="recent">الأحدث</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredProjects.length} مشروع {projectFilter !== 'all' && `من نوع ${stats[projectFilter as keyof typeof stats]?.label}`}
          </div>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover-lift group">
              {/* Project Screenshot */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {project.screenshot ? (
                  <img
                    src={project.screenshot}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Code className="h-12 w-12 text-primary/30" />
                  </div>
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    {project.demo_url && (
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Eye className="h-3 w-3" />
                        معاينة
                      </Button>
                    )}
                    {project.project_url && (
                      <Button size="sm" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        زيارة
                      </Button>
                    )}
                  </div>
                </div>

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                    ⭐ مميز
                  </div>
                )}

                {/* Project type icon */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                  {React.createElement(getProjectTypeIcon(project.project_type), {
                    className: "h-4 w-4 text-primary"
                  })}
                </div>
              </div>

              <CardContent className="p-4">
                {/* Student Info */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={project.student_avatar} />
                    <AvatarFallback className="text-xs">
                      {project.student_name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{project.student_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      عمر {project.student_age} • مستوى {project.student_level}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= project.instructor_rating
                            ? 'text-yellow-500 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {project.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {project.likes}
                    </div>
                  </div>
                  <span>{formatDate(project.completion_date)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لا توجد مشاريع مطابقة
              </h3>
              <p className="text-muted-foreground mb-4">
                جرب تغيير الفلترات أو فرز المشاريع للعثور على ما تبحث عنه
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setProjectFilter('all');
                  setSortBy('featured');
                }}
              >
                عرض جميع المشاريع
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-100">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              هل أنت مستعد لإنشاء مشروعك الخاص؟
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              انضم إلى آلاف الطلاب الذين بدأوا رحلتهم في عالم البرمجة والابتكار.
              تعلم المهارات التي تحتاجها لتحويل أفكارك إلى واقع.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Code className="h-4 w-4" />
                ابدأ التعلم الآن
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="h-4 w-4" />
                شارك مشروعك
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseProjects;