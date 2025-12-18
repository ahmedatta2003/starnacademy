import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Users,
  Shield,
  Plus,
  Trash2,
  Edit,
  Image,
  FolderOpen,
  Home,
  Save,
  X,
  Star,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import logo from "@/assets/starn-logo.png";

interface StudentShowcase {
  id: string;
  name: string;
  age: number | null;
  grade_level: string | null;
  avatar_url: string | null;
  bio: string | null;
  achievements: string[] | null;
  stickers_count: number;
  projects_count: number;
  is_featured: boolean;
  created_at: string;
}

interface StudentProject {
  id: string;
  student_id: string | null;
  title: string;
  description: string | null;
  project_type: string | null;
  image_url: string | null;
  video_url: string | null;
  technologies: string[] | null;
  is_featured: boolean;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentShowcase[]>([]);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  
  // Add Student Dialog
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    grade_level: '',
    bio: '',
    avatar_url: '',
    stickers_count: 0,
    achievements: ''
  });

  // Add Project Dialog
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    student_id: '',
    title: '',
    description: '',
    project_type: '',
    image_url: '',
    video_url: '',
    technologies: ''
  });

  // Edit Student Dialog
  const [editingStudent, setEditingStudent] = useState<StudentShowcase | null>(null);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadData();
    }
  }, [user, profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load students showcase
      const { data: studentsData, error: studentsError } = await supabase
        .from('students_showcase')
        .select('*')
        .order('created_at', { ascending: false });

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('student_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      const achievements = newStudent.achievements.split(',').map(a => a.trim()).filter(a => a);
      
      const { data, error } = await supabase
        .from('students_showcase')
        .insert({
          name: newStudent.name,
          age: newStudent.age ? parseInt(newStudent.age) : null,
          grade_level: newStudent.grade_level || null,
          bio: newStudent.bio || null,
          avatar_url: newStudent.avatar_url || null,
          stickers_count: newStudent.stickers_count,
          achievements: achievements.length > 0 ? achievements : null,
          is_featured: false,
          projects_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [data, ...prev]);
      setShowAddStudent(false);
      setNewStudent({ name: '', age: '', grade_level: '', bio: '', avatar_url: '', stickers_count: 0, achievements: '' });
      toast.success('تم إضافة الطالب بنجاح');
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('حدث خطأ في إضافة الطالب');
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    
    try {
      const { error } = await supabase
        .from('students_showcase')
        .update({
          name: editingStudent.name,
          age: editingStudent.age,
          grade_level: editingStudent.grade_level,
          bio: editingStudent.bio,
          avatar_url: editingStudent.avatar_url,
          stickers_count: editingStudent.stickers_count,
          achievements: editingStudent.achievements,
          is_featured: editingStudent.is_featured
        })
        .eq('id', editingStudent.id);

      if (error) throw error;

      setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
      setEditingStudent(null);
      toast.success('تم تحديث بيانات الطالب بنجاح');
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('حدث خطأ في تحديث بيانات الطالب');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
    
    try {
      const { error } = await supabase
        .from('students_showcase')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success('تم حذف الطالب بنجاح');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('حدث خطأ في حذف الطالب');
    }
  };

  const handleAddProject = async () => {
    try {
      const technologies = newProject.technologies.split(',').map(t => t.trim()).filter(t => t);
      
      const { data, error } = await supabase
        .from('student_projects')
        .insert({
          student_id: newProject.student_id || null,
          title: newProject.title,
          description: newProject.description || null,
          project_type: newProject.project_type || null,
          image_url: newProject.image_url || null,
          video_url: newProject.video_url || null,
          technologies: technologies.length > 0 ? technologies : null,
          is_featured: false
        })
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      setShowAddProject(false);
      setNewProject({ student_id: '', title: '', description: '', project_type: '', image_url: '', video_url: '', technologies: '' });
      toast.success('تم إضافة المشروع بنجاح');
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('حدث خطأ في إضافة المشروع');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    
    try {
      const { error } = await supabase
        .from('student_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('تم حذف المشروع بنجاح');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('حدث خطأ في حذف المشروع');
    }
  };

  // Check admin access
  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-500/10 to-coral/10 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-20 w-20 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">لوحة تحكم الإدارة</h2>
            <p className="text-muted-foreground mb-6">
              هذه الصفحة متاحة فقط لمسؤولي النظام المعتمدين
            </p>
            <Link to="/auth">
              <Button className="w-full">
                تسجيل الدخول كمسؤول
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-500/10 to-coral/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-500/10 to-coral/10">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Starn Academy Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-primary">Starn Academy</h1>
              <p className="text-xs text-muted-foreground">لوحة تحكم الإدارة</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              مسؤول النظام
            </Badge>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 ml-2" />
                الصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold">{students.length}</div>
              <div className="text-muted-foreground">طلاب في المعرض</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FolderOpen className="h-10 w-10 mx-auto mb-3 text-green-500" />
              <div className="text-3xl font-bold">{projects.length}</div>
              <div className="text-muted-foreground">مشاريع الطلاب</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-10 w-10 mx-auto mb-3 text-yellow-500" />
              <div className="text-3xl font-bold">{students.filter(s => s.is_featured).length}</div>
              <div className="text-muted-foreground">طلاب مميزون</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              الطلاب
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              المشاريع
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">إدارة الطلاب</h2>
              <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة طالب جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>إضافة طالب جديد</DialogTitle>
                    <DialogDescription>أدخل بيانات الطالب الجديد</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>اسم الطالب *</Label>
                      <Input 
                        value={newStudent.name} 
                        onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="أدخل اسم الطالب"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>العمر</Label>
                        <Input 
                          type="number"
                          value={newStudent.age} 
                          onChange={(e) => setNewStudent(prev => ({ ...prev, age: e.target.value }))}
                          placeholder="العمر"
                        />
                      </div>
                      <div>
                        <Label>المستوى الدراسي</Label>
                        <Input 
                          value={newStudent.grade_level} 
                          onChange={(e) => setNewStudent(prev => ({ ...prev, grade_level: e.target.value }))}
                          placeholder="مثال: الصف الخامس"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>رابط الصورة</Label>
                      <Input 
                        value={newStudent.avatar_url} 
                        onChange={(e) => setNewStudent(prev => ({ ...prev, avatar_url: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>نبذة عن الطالب</Label>
                      <Textarea 
                        value={newStudent.bio} 
                        onChange={(e) => setNewStudent(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="نبذة مختصرة عن الطالب"
                      />
                    </div>
                    <div>
                      <Label>عدد الستيكرات</Label>
                      <Input 
                        type="number"
                        value={newStudent.stickers_count} 
                        onChange={(e) => setNewStudent(prev => ({ ...prev, stickers_count: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label>الإنجازات (مفصولة بفواصل)</Label>
                      <Input 
                        value={newStudent.achievements} 
                        onChange={(e) => setNewStudent(prev => ({ ...prev, achievements: e.target.value }))}
                        placeholder="إنجاز 1, إنجاز 2, إنجاز 3"
                      />
                    </div>
                    <Button onClick={handleAddStudent} className="w-full" disabled={!newStudent.name}>
                      <Save className="h-4 w-4 ml-2" />
                      حفظ الطالب
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <Card key={student.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{student.name}</h3>
                          {student.is_featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 ml-1" />
                              مميز
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {student.age && `${student.age} سنة`} {student.grade_level && `• ${student.grade_level}`}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">
                            <Award className="h-3 w-3 ml-1" />
                            {student.stickers_count} ستيكر
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setEditingStudent(student)}
                      >
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {students.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لا يوجد طلاب بعد</h3>
                  <p className="text-muted-foreground">ابدأ بإضافة طلاب جدد للمعرض</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">إدارة المشاريع</h2>
              <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة مشروع جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>إضافة مشروع جديد</DialogTitle>
                    <DialogDescription>أدخل بيانات المشروع الجديد</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>عنوان المشروع *</Label>
                      <Input 
                        value={newProject.title} 
                        onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="أدخل عنوان المشروع"
                      />
                    </div>
                    <div>
                      <Label>الطالب (اختياري)</Label>
                      <select 
                        className="w-full border rounded-md p-2"
                        value={newProject.student_id}
                        onChange={(e) => setNewProject(prev => ({ ...prev, student_id: e.target.value }))}
                      >
                        <option value="">اختر الطالب</option>
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>نوع المشروع</Label>
                      <Input 
                        value={newProject.project_type} 
                        onChange={(e) => setNewProject(prev => ({ ...prev, project_type: e.target.value }))}
                        placeholder="مثال: لعبة, موقع, تطبيق"
                      />
                    </div>
                    <div>
                      <Label>وصف المشروع</Label>
                      <Textarea 
                        value={newProject.description} 
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="وصف مختصر للمشروع"
                      />
                    </div>
                    <div>
                      <Label>رابط الصورة</Label>
                      <Input 
                        value={newProject.image_url} 
                        onChange={(e) => setNewProject(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>رابط الفيديو (اختياري)</Label>
                      <Input 
                        value={newProject.video_url} 
                        onChange={(e) => setNewProject(prev => ({ ...prev, video_url: e.target.value }))}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    <div>
                      <Label>التقنيات المستخدمة (مفصولة بفواصل)</Label>
                      <Input 
                        value={newProject.technologies} 
                        onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
                        placeholder="Python, Scratch, HTML"
                      />
                    </div>
                    <Button onClick={handleAddProject} className="w-full" disabled={!newProject.title}>
                      <Save className="h-4 w-4 ml-2" />
                      حفظ المشروع
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  {project.image_url && (
                    <div className="h-40 bg-muted overflow-hidden">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.project_type && (
                        <Badge variant="outline">{project.project_type}</Badge>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {projects.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لا يوجد مشاريع بعد</h3>
                  <p className="text-muted-foreground">ابدأ بإضافة مشاريع جديدة للطلاب</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الطالب</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div>
                <Label>اسم الطالب</Label>
                <Input 
                  value={editingStudent.name} 
                  onChange={(e) => setEditingStudent(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>العمر</Label>
                  <Input 
                    type="number"
                    value={editingStudent.age || ''} 
                    onChange={(e) => setEditingStudent(prev => prev ? { ...prev, age: parseInt(e.target.value) || null } : null)}
                  />
                </div>
                <div>
                  <Label>المستوى الدراسي</Label>
                  <Input 
                    value={editingStudent.grade_level || ''} 
                    onChange={(e) => setEditingStudent(prev => prev ? { ...prev, grade_level: e.target.value } : null)}
                  />
                </div>
              </div>
              <div>
                <Label>رابط الصورة</Label>
                <Input 
                  value={editingStudent.avatar_url || ''} 
                  onChange={(e) => setEditingStudent(prev => prev ? { ...prev, avatar_url: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>نبذة عن الطالب</Label>
                <Textarea 
                  value={editingStudent.bio || ''} 
                  onChange={(e) => setEditingStudent(prev => prev ? { ...prev, bio: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>عدد الستيكرات</Label>
                <Input 
                  type="number"
                  value={editingStudent.stickers_count} 
                  onChange={(e) => setEditingStudent(prev => prev ? { ...prev, stickers_count: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={editingStudent.is_featured}
                  onChange={(e) => setEditingStudent(prev => prev ? { ...prev, is_featured: e.target.checked } : null)}
                  className="rounded"
                />
                <Label>طالب مميز</Label>
              </div>
              <Button onClick={handleUpdateStudent} className="w-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ التغييرات
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
