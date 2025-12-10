import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, User, Mail, Phone, GraduationCap, Users, Code, Shield } from 'lucide-react';
import { z } from 'zod';

const baseSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

const childSchema = baseSchema.extend({
  role: z.literal('child'),
  age: z.number().min(6).max(18),
  gradeLevel: z.string().min(1, { message: "يرجى اختيار المرحلة الدراسية" }),
  schoolName: z.string().optional(),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  parentEmail: z.string().email({ message: "بريد ولي الأمر غير صحيح" }),
  termsAccepted: z.boolean().refine(val => val === true, { message: "يجب قبول الشروط والأحكام" }),
});

const guardianSchema = baseSchema.extend({
  role: z.literal('guardian'),
  relationship: z.enum(['father', 'mother', 'guardian', 'other']),
  phone: z.string().min(10, { message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل" }),
  occupation: z.string().optional(),
  address: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "يجب قبول الشروط والأحكام" }),
});

const instructorSchema = baseSchema.extend({
  role: z.literal('instructor'),
  phone: z.string().min(10, { message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل" }),
  bio: z.string().min(50, { message: "السيرة الذاتية يجب أن تكون 50 حرف على الأقل" }),
  specialization: z.array(z.string()).min(1, { message: "يجب اختيار تخصص واحد على الأقل" }),
  education: z.string().min(10, { message: "المؤهل التعليمي مطلوب" }),
  yearsOfExperience: z.number().min(0),
  backgroundCheck: z.boolean().default(false),
  termsAccepted: z.boolean().refine(val => val === true, { message: "يجب قبول الشروط والأحكام" }),
});

const adminSchema = baseSchema.extend({
  role: z.literal('admin'),
  termsAccepted: z.boolean().refine(val => val === true, { message: "يجب قبول الشروط والأحكام" }),
});

const registrationSchema = z.discriminatedUnion('role', [
  childSchema,
  guardianSchema,
  instructorSchema,
  adminSchema,
]);

type RegistrationData = z.infer<typeof registrationSchema>;

const EnhancedRegistration: React.FC = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'child' | 'guardian' | 'instructor' | 'admin'>('child');
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState<RegistrationData>({
    role: 'child',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    age: 0,
    gradeLevel: '',
    schoolName: '',
    skillLevel: 'beginner',
    parentEmail: '',
    relationship: 'guardian',
    phone: '',
    occupation: '',
    address: '',
    bio: '',
    specialization: [],
    education: '',
    yearsOfExperience: 0,
    backgroundCheck: false,
    termsAccepted: false,
  });

  const specializationOptions = [
    { value: 'programming_basics', label: 'أساسيات البرمجة' },
    { value: 'game_development', label: 'تطوير الألعاب' },
    { value: 'web_development', label: 'تطوير الويب' },
    { value: 'app_development', label: 'تطوير التطبيقات' },
    { value: 'robotics', label: 'الروبوتات' },
    { value: 'ai_ml', label: 'الذكاء الاصطناعي' },
    { value: 'creative_coding', label: 'البرمجة الإبداعية' },
  ];

  const gradeOptions = [
    { value: 'kg1', label: 'KG1' },
    { value: 'kg2', label: 'KG2' },
    { value: 'grade1', label: 'الصف الأول' },
    { value: 'grade2', label: 'الصف الثاني' },
    { value: 'grade3', label: 'الصف الثالث' },
    { value: 'grade4', label: 'الصف الرابع' },
    { value: 'grade5', label: 'الصف الخامس' },
    { value: 'grade6', label: 'الصف السادس' },
    { value: 'grade7', label: 'الصف السابع' },
    { value: 'grade8', label: 'الصف الثامن' },
    { value: 'grade9', label: 'الصف التاسع' },
    { value: 'grade10', label: 'الصف العاشر' },
    { value: 'grade11', label: 'الصف الحادي عشر' },
    { value: 'grade12', label: 'الصف الثاني عشر' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const additionalData: any = {};
    switch (selectedRole) {
      case 'child':
        additionalData.age = formData.age;
        additionalData.grade_level = formData.gradeLevel;
        additionalData.school_name = formData.schoolName;
        additionalData.skill_level = formData.skillLevel;
        additionalData.parent_email = formData.parentEmail;
        break;
      case 'guardian':
        additionalData.phone = formData.phone;
        additionalData.relationship = formData.relationship;
        additionalData.occupation = formData.occupation;
        additionalData.address = formData.address;
        break;
      case 'instructor':
        additionalData.phone = formData.phone;
        additionalData.bio = formData.bio;
        additionalData.specialization = formData.specialization;
        additionalData.education = formData.education;
        additionalData.years_of_experience = formData.yearsOfExperience;
        additionalData.background_check = formData.backgroundCheck;
        break;
    }

    await signUp(formData.email, formData.password, formData.fullName, selectedRole, additionalData);
    setLoading(false);
  };

  const renderRoleIcon = (role: string) => {
    switch (role) {
      case 'child': return <User className="h-8 w-8" />;
      case 'guardian': return <Users className="h-8 w-8" />;
      case 'instructor': return <GraduationCap className="h-8 w-8" />;
      case 'admin': return <Shield className="h-8 w-8" />;
      default: return <User className="h-8 w-8" />;
    }
  };

  const renderRoleTitle = (role: string) => {
    switch (role) {
      case 'child': return 'طالب';
      case 'guardian': return 'ولي أمر';
      case 'instructor': return 'مدرب';
      case 'admin': return 'مدير نظام';
      default: return role;
    }
  };

  const renderRoleDescription = (role: string) => {
    switch (role) {
      case 'child': return 'للتسجيل كطالب في الأكاديمية (6-18 سنة)';
      case 'guardian': return 'للتسجيل كولي أمر ومتابعة تقدم الأبناء';
      case 'instructor': return 'للتسجيل كمدرب وإنشاء وإدارة الدورات';
      case 'admin': return 'للتسجيل كمدير النظام';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-background p-4">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Starn Academy
          </CardTitle>
          <CardDescription className="text-base mt-2">
            منصة تعليم البرمجة للأطفال والشباب
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="child" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                طالب
              </TabsTrigger>
              <TabsTrigger value="guardian" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                ولي أمر
              </TabsTrigger>
              <TabsTrigger value="instructor" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                مدرب
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                مدير
              </TabsTrigger>
            </TabsList>

            {/* Role Preview */}
            <div className="text-center mb-6 p-4 bg-muted rounded-lg">
              {renderRoleIcon(selectedRole)}
              <h3 className="text-lg font-semibold mt-2">{renderRoleTitle(selectedRole)}</h3>
              <p className="text-sm text-muted-foreground">{renderRoleDescription(selectedRole)}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="أحمد محمد"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    dir="ltr"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="•••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="•••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Child Specific Fields */}
              {selectedRole === 'child' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">العمر *</Label>
                      <Input
                        id="age"
                        type="number"
                        min="6"
                        max="18"
                        placeholder="12"
                        value={formData.age || ''}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                        required
                      />
                      {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gradeLevel">المرحلة الدراسية *</Label>
                      <Select
                        value={formData.gradeLevel}
                        onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المرحلة الدراسية" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradeOptions.map((grade) => (
                            <SelectItem key={grade.value} value={grade.value}>
                              {grade.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.gradeLevel && <p className="text-sm text-destructive">{errors.gradeLevel}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="skillLevel">المستوى الحالي *</Label>
                      <Select
                        value={formData.skillLevel}
                        onValueChange={(value: any) => setFormData({ ...formData, skillLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">مبتدئ</SelectItem>
                          <SelectItem value="intermediate">متوسط</SelectItem>
                          <SelectItem value="advanced">متقدم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentEmail">بريد ولي الأمر *</Label>
                      <Input
                        id="parentEmail"
                        type="email"
                        placeholder="parent@email.com"
                        value={formData.parentEmail}
                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        required
                        dir="ltr"
                      />
                      {errors.parentEmail && <p className="text-sm text-destructive">{errors.parentEmail}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolName">اسم المدرسة</Label>
                    <Input
                      id="schoolName"
                      type="text"
                      placeholder="مدرسة النجاح"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Guardian Specific Fields */}
              {selectedRole === 'guardian' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">صلة القرابة *</Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value: any) => setFormData({ ...formData, relationship: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر صلة القرابة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="father">الأب</SelectItem>
                        <SelectItem value="mother">الأم</SelectItem>
                        <SelectItem value="guardian">ولي أمر</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.relationship && <p className="text-sm text-destructive">{errors.relationship}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم اله *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="05xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        dir="ltr"
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation">المهنة</Label>
                      <Input
                        id="occupation"
                        type="text"
                        placeholder="مهندس"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Textarea
                      id="address"
                      placeholder="العنوان الكامل"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Instructor Specific Fields */}
              {selectedRole === 'instructor' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio">السيرة الذاتية *</Label>
                    <Textarea
                      id="bio"
                      placeholder="اكتب سيرتك الذاتية وخبراتك في التعليم..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      required
                    />
                    {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="education">المؤهل التعليمي *</Label>
                      <Input
                        id="education"
                        type="text"
                        placeholder="بكالوريوس علوم الحاسوب"
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        required
                      />
                      {errors.education && <p className="text-sm text-destructive">{errors.education}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience">سنوات الخبرة *</Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        min="0"
                        placeholder="5"
                        value={formData.yearsOfExperience}
                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">التخصصات *</Label>
                    <Select
                      value={formData.specialization?.[0] || ''}
                      onValueChange={(value) => {
                        const newSpecialization = formData.specialization.includes(value)
                          ? formData.specialization.filter(s => s !== value)
                          : [...formData.specialization, value];
                        setFormData({ ...formData, specialization: newSpecialization });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التخصصات" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializationOptions.map((spec) => (
                          <SelectItem key={spec.value} value={spec.value}>
                            {spec.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary" className="cursor-pointer"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              specialization: formData.specialization.filter(s => s !== spec)
                            });
                          }}>
                          {specializationOptions.find(s => s.value === spec)?.label} ×
                        </Badge>
                      ))}
                    </div>
                    {errors.specialization && <p className="text-sm text-destructive">{errors.specialization}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructorPhone">رقم اله *</Label>
                    <Input
                      id="instructorPhone"
                      type="tel"
                      placeholder="05xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      dir="ltr"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="backgroundCheck"
                      checked={formData.backgroundCheck}
                      onCheckedChange={(checked) => setFormData({ ...formData, backgroundCheck: !!checked })}
                    />
                    <Label htmlFor="backgroundCheck">أوافق على إجراء فحص الخلفية (مطلوب للمدربين)</Label>
                  </div>
                </>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: !!checked })}
                />
                <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
                  أوافق على <a href="/terms" className="text-primary hover:underline">الشروط والأحكام</a> و{' '}
                  <a href="/privacy" className="text-primary hover:underline">سياسة الخصوصية</a> لأكاديمية ستارن
                </Label>
              </div>
              {errors.termsAccepted && <p className="text-sm text-destructive">{errors.termsAccepted}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  `إنشاء حساب ${renderRoleTitle(selectedRole)}`
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRegistration;