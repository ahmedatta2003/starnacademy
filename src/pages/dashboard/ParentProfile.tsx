import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User,
  Users,
  Calendar,
  Star,
  Award,
  MessageSquare,
  GraduationCap,
  Target,
  TrendingUp
} from "lucide-react";

// Mock child data
interface ChildData {
  id: string;
  name: string;
  level: number;
  stars: number;
  courses: number;
  avatar?: string;
}

const ParentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState<any>(null);

  // Mock data for children
  const [children] = useState<ChildData[]>([
    { id: '1', name: 'أحمد', level: 5, stars: 120, courses: 3, avatar: undefined },
    { id: '2', name: 'فاطمة', level: 3, stars: 85, courses: 2, avatar: undefined },
  ]);

  useEffect(() => {
    const fetchParentData = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setParentData(profile);
      } catch (error) {
        console.error('Error fetching parent data:', error);
        toast.error('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">لوحة ولي الأمر</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Users className="h-4 w-4 ml-2" />
          {children.length} أبناء
        </Badge>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={parentData?.avatar_url} />
              <AvatarFallback className="text-2xl">
                {parentData?.full_name?.charAt(0) || 'و'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{parentData?.full_name || 'ولي أمر'}</h2>
              <p className="text-muted-foreground">{parentData?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                <Calendar className="inline h-4 w-4 ml-1" />
                انضم في: {new Date(parentData?.created_at || Date.now()).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="children" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="children">الأبناء</TabsTrigger>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
        </TabsList>

        {/* Children Tab */}
        <TabsContent value="children" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <Card key={child.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback className="text-xl">
                        {child.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{child.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary">
                          <GraduationCap className="h-3 w-3 ml-1" />
                          المستوى {child.level}
                        </Badge>
                        <Badge variant="outline">
                          <Star className="h-3 w-3 ml-1 text-yellow-500" />
                          {child.stars} نجمة
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {child.courses} دورات مسجلة
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="text-2xl font-bold">{children.length}</h3>
                <p className="text-muted-foreground">عدد الأبناء</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="text-2xl font-bold">
                  {children.reduce((acc, c) => acc + c.stars, 0)}
                </h3>
                <p className="text-muted-foreground">إجمالي النجوم</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="text-2xl font-bold">
                  {children.reduce((acc, c) => acc + c.courses, 0)}
                </h3>
                <p className="text-muted-foreground">الدورات المسجلة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="text-2xl font-bold">
                  {Math.round(children.reduce((acc, c) => acc + c.level, 0) / children.length)}
                </h3>
                <p className="text-muted-foreground">متوسط المستوى</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentProfile;
