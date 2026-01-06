import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileUploader from '@/components/FileUploader';
import AdminReportsPanel from '@/components/AdminReportsPanel';
import {
  Users,
  Shield,
  Plus,
  Trash2,
  Edit,
  FolderOpen,
  Home,
  Save,
  Star,
  Award,
  Handshake,
  Video,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Flag
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

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
}

interface FreeSessionBooking {
  id: string;
  child_name: string;
  child_age: number;
  parent_email: string;
  parent_phone: string;
  status: string;
  notes: string | null;
  session_date: string | null;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [students, setStudents] = useState<StudentShowcase[]>([]);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [bookings, setBookings] = useState<FreeSessionBooking[]>([]);
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

  // Add Partner Dialog
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    display_order: 0
  });

  // Edit states
  const [editingStudent, setEditingStudent] = useState<StudentShowcase | null>(null);
  const [editingProject, setEditingProject] = useState<StudentProject | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadData();
    }
  }, [user, profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [studentsRes, projectsRes, partnersRes, bookingsRes] = await Promise.all([
        supabase.from('students_showcase').select('*').order('created_at', { ascending: false }),
        supabase.from('student_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('partners').select('*').order('display_order', { ascending: true }),
        supabase.from('free_session_bookings').select('*').order('created_at', { ascending: false })
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (projectsRes.error) throw projectsRes.error;
      
      setStudents(studentsRes.data || []);
      setProjects(projectsRes.data || []);
      setPartners(partnersRes.data || []);
      setBookings(bookingsRes.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Student handlers
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
      const { error } = await supabase.from('students_showcase').delete().eq('id', id);
      if (error) throw error;
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success('تم حذف الطالب بنجاح');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('حدث خطأ في حذف الطالب');
    }
  };

  // Project handlers
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

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    
    try {
      const { error } = await supabase
        .from('student_projects')
        .update({
          title: editingProject.title,
          description: editingProject.description,
          project_type: editingProject.project_type,
          image_url: editingProject.image_url,
          video_url: editingProject.video_url,
          technologies: editingProject.technologies,
          is_featured: editingProject.is_featured
        })
        .eq('id', editingProject.id);

      if (error) throw error;

      setProjects(prev => prev.map(p => p.id === editingProject.id ? editingProject : p));
      setEditingProject(null);
      toast.success('تم تحديث المشروع بنجاح');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('حدث خطأ في تحديث المشروع');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    
    try {
      const { error } = await supabase.from('student_projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('تم حذف المشروع بنجاح');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('حدث خطأ في حذف المشروع');
    }
  };

  // Partner handlers
  const handleAddPartner = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert({
          name: newPartner.name,
          logo_url: newPartner.logo_url || null,
          website_url: newPartner.website_url || null,
          display_order: newPartner.display_order,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setPartners(prev => [...prev, data].sort((a, b) => a.display_order - b.display_order));
      setShowAddPartner(false);
      setNewPartner({ name: '', logo_url: '', website_url: '', display_order: 0 });
      toast.success('تم إضافة الشريك بنجاح');
    } catch (error) {
      console.error('Error adding partner:', error);
      toast.error('حدث خطأ في إضافة الشريك');
    }
  };

  const handleUpdatePartner = async () => {
    if (!editingPartner) return;
    
    try {
      const { error } = await supabase
        .from('partners')
        .update({
          name: editingPartner.name,
          logo_url: editingPartner.logo_url,
          website_url: editingPartner.website_url,
          display_order: editingPartner.display_order,
          is_active: editingPartner.is_active
        })
        .eq('id', editingPartner.id);

      if (error) throw error;

      setPartners(prev => prev.map(p => p.id === editingPartner.id ? editingPartner : p));
      setEditingPartner(null);
      toast.success('تم تحديث الشريك بنجاح');
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error('حدث خطأ في تحديث الشريك');
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الشريك؟')) return;
    
    try {
      const { error } = await supabase.from('partners').delete().eq('id', id);
      if (error) throw error;
      setPartners(prev => prev.filter(p => p.id !== id));
      toast.success('تم حذف الشريك بنجاح');
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('حدث خطأ في حذف الشريك');
    }
  };

  // Booking handlers
  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('free_session_bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast.success('تم تحديث حالة الحجز');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('حدث خطأ في تحديث الحجز');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return;
    
    try {
      const { error } = await supabase.from('free_session_bookings').delete().eq('id', id);
      if (error) throw error;
      setBookings(prev => prev.filter(b => b.id !== id));
      toast.success('تم حذف الحجز بنجاح');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('حدث خطأ في حذف الحجز');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 ml-1" />مؤكد</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 ml-1" />ملغي</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 ml-1" />قيد الانتظار</Badge>;
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
              <Button className="w-full">تسجيل الدخول كمسؤول</Button>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <Handshake className="h-10 w-10 mx-auto mb-3 text-blue-500" />
              <div className="text-3xl font-bold">{partners.length}</div>
              <div className="text-muted-foreground">شركاء</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-10 w-10 mx-auto mb-3 text-coral" />
              <div className="text-3xl font-bold">{bookings.length}</div>
              <div className="text-muted-foreground">حجوزات</div>
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
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              الطلاب
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              المشاريع
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              الشركاء
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              الحجوزات
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              البلاغات
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
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                    <FileUploader
                      label="صورة الطالب"
                      type="image"
                      folder="students"
                      currentUrl={newStudent.avatar_url}
                      onUploadComplete={(url) => setNewStudent(prev => ({ ...prev, avatar_url: url }))}
                    />
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
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingStudent(student)}>
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteStudent(student.id)}>
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
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                      <Select 
                        value={newProject.student_id} 
                        onValueChange={(value) => setNewProject(prev => ({ ...prev, student_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الطالب" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FileUploader
                      label="صورة المشروع"
                      type="image"
                      folder="projects"
                      currentUrl={newProject.image_url}
                      onUploadComplete={(url) => setNewProject(prev => ({ ...prev, image_url: url }))}
                    />
                    <FileUploader
                      label="فيديو المشروع"
                      type="video"
                      folder="projects/videos"
                      currentUrl={newProject.video_url}
                      onUploadComplete={(url) => setNewProject(prev => ({ ...prev, video_url: url }))}
                    />
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
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.video_url && <Video className="h-4 w-4 text-blue-500" />}
                    </div>
                    {project.project_type && <Badge variant="outline" className="mb-2">{project.project_type}</Badge>}
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingProject(project)}>
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
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

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">إدارة الشركاء</h2>
              <Dialog open={showAddPartner} onOpenChange={setShowAddPartner}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة شريك جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>إضافة شريك جديد</DialogTitle>
                    <DialogDescription>أدخل بيانات الشريك الجديد</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>اسم الشريك *</Label>
                      <Input 
                        value={newPartner.name} 
                        onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="أدخل اسم الشريك"
                      />
                    </div>
                    <FileUploader
                      label="شعار الشريك"
                      type="image"
                      folder="partners"
                      currentUrl={newPartner.logo_url}
                      onUploadComplete={(url) => setNewPartner(prev => ({ ...prev, logo_url: url }))}
                    />
                    <div>
                      <Label>رابط الموقع (اختياري)</Label>
                      <Input 
                        value={newPartner.website_url} 
                        onChange={(e) => setNewPartner(prev => ({ ...prev, website_url: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>ترتيب العرض</Label>
                      <Input 
                        type="number"
                        value={newPartner.display_order} 
                        onChange={(e) => setNewPartner(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <Button onClick={handleAddPartner} className="w-full" disabled={!newPartner.name}>
                      <Save className="h-4 w-4 ml-2" />
                      حفظ الشريك
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="h-20 flex items-center justify-center bg-muted rounded-lg mb-3">
                      {partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.name} className="max-h-16 max-w-full object-contain" />
                      ) : (
                        <Handshake className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-center mb-2">{partner.name}</h3>
                    <p className="text-xs text-muted-foreground text-center mb-3">ترتيب: {partner.display_order}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingPartner(partner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePartner(partner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {partners.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Handshake className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لا يوجد شركاء بعد</h3>
                  <p className="text-muted-foreground">ابدأ بإضافة شركاء جدد</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">حجوزات الحصص المجانية</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{bookings.filter(b => b.status === 'pending').length} قيد الانتظار</Badge>
                <Badge className="bg-green-500">{bookings.filter(b => b.status === 'confirmed').length} مؤكد</Badge>
              </div>
            </div>

            {/* Bookings Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full" dir="rtl">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-4 text-right font-medium">اسم الطفل</th>
                        <th className="p-4 text-right font-medium">العمر</th>
                        <th className="p-4 text-right font-medium">البريد الإلكتروني</th>
                        <th className="p-4 text-right font-medium">رقم الهاتف</th>
                        <th className="p-4 text-right font-medium">الحالة</th>
                        <th className="p-4 text-right font-medium">تاريخ الحجز</th>
                        <th className="p-4 text-right font-medium">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/30">
                          <td className="p-4 font-medium">{booking.child_name}</td>
                          <td className="p-4">{booking.child_age} سنة</td>
                          <td className="p-4">
                            <a href={`mailto:${booking.parent_email}`} className="flex items-center gap-1 text-primary hover:underline">
                              <Mail className="h-4 w-4" />
                              {booking.parent_email}
                            </a>
                          </td>
                          <td className="p-4">
                            <a href={`tel:${booking.parent_phone}`} className="flex items-center gap-1 text-primary hover:underline">
                              <Phone className="h-4 w-4" />
                              {booking.parent_phone}
                            </a>
                          </td>
                          <td className="p-4">{getStatusBadge(booking.status)}</td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {new Date(booking.created_at).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Select
                                value={booking.status}
                                onValueChange={(value) => handleUpdateBookingStatus(booking.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                                  <SelectItem value="confirmed">مؤكد</SelectItem>
                                  <SelectItem value="cancelled">ملغي</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteBooking(booking.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {bookings.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد حجوزات بعد</h3>
                  <p className="text-muted-foreground">سيظهر هنا جميع حجوزات الحصص المجانية</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <AdminReportsPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
              <FileUploader
                label="صورة الطالب"
                type="image"
                folder="students"
                currentUrl={editingStudent.avatar_url || ''}
                onUploadComplete={(url) => setEditingStudent(prev => prev ? { ...prev, avatar_url: url } : null)}
              />
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

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل المشروع</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div>
                <Label>عنوان المشروع</Label>
                <Input 
                  value={editingProject.title} 
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>نوع المشروع</Label>
                <Input 
                  value={editingProject.project_type || ''} 
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, project_type: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>وصف المشروع</Label>
                <Textarea 
                  value={editingProject.description || ''} 
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              <FileUploader
                label="صورة المشروع"
                type="image"
                folder="projects"
                currentUrl={editingProject.image_url || ''}
                onUploadComplete={(url) => setEditingProject(prev => prev ? { ...prev, image_url: url } : null)}
              />
              <FileUploader
                label="فيديو المشروع"
                type="video"
                folder="projects/videos"
                currentUrl={editingProject.video_url || ''}
                onUploadComplete={(url) => setEditingProject(prev => prev ? { ...prev, video_url: url } : null)}
              />
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={editingProject.is_featured}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, is_featured: e.target.checked } : null)}
                  className="rounded"
                />
                <Label>مشروع مميز</Label>
              </div>
              <Button onClick={handleUpdateProject} className="w-full">
                <Save className="h-4 w-4 ml-2" />
                حفظ التغييرات
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={!!editingPartner} onOpenChange={() => setEditingPartner(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تعديل الشريك</DialogTitle>
          </DialogHeader>
          {editingPartner && (
            <div className="space-y-4">
              <div>
                <Label>اسم الشريك</Label>
                <Input 
                  value={editingPartner.name} 
                  onChange={(e) => setEditingPartner(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <FileUploader
                label="شعار الشريك"
                type="image"
                folder="partners"
                currentUrl={editingPartner.logo_url || ''}
                onUploadComplete={(url) => setEditingPartner(prev => prev ? { ...prev, logo_url: url } : null)}
              />
              <div>
                <Label>رابط الموقع</Label>
                <Input 
                  value={editingPartner.website_url || ''} 
                  onChange={(e) => setEditingPartner(prev => prev ? { ...prev, website_url: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>ترتيب العرض</Label>
                <Input 
                  type="number"
                  value={editingPartner.display_order} 
                  onChange={(e) => setEditingPartner(prev => prev ? { ...prev, display_order: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={editingPartner.is_active}
                  onChange={(e) => setEditingPartner(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                  className="rounded"
                />
                <Label>نشط</Label>
              </div>
              <Button onClick={handleUpdatePartner} className="w-full">
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
