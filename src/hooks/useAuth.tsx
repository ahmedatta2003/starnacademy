import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role: 'admin' | 'guardian' | 'child' | 'instructor', additionalData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: error.message === "Invalid login credentials" 
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            : error.message,
        });
      } else {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في Starn Academy",
        });
        navigate('/dashboard');
      }
      
      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'guardian' | 'child' | 'instructor', additionalData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/auth`;

      const { error: authError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast({
            variant: "destructive",
            title: "خطأ في التسجيل",
            description: "هذا البريد الإلكتروني مسجل بالفعل",
          });
        } else {
          toast({
            variant: "destructive",
            title: "خطأ في التسجيل",
            description: authError.message,
          });
        }
        return { error: authError };
      }

      // Create profile record
      if (data.user) {
        const profileData: any = {
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
          is_active: true,
          email_verified: false,
        };

        if (additionalData?.date_of_birth) {
          profileData.date_of_birth = additionalData.date_of_birth;
        }

        if (additionalData?.phone) {
          profileData.phone = additionalData.phone;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast({
            variant: "destructive",
            title: "خطأ في إنشاء الملف الشخصي",
            description: "تم تسجيل الحساب ولكن حدث خطأ في إنشاء الملف الشخصي",
          });
          return { error: profileError };
        }

        // Create role-specific profile
        let roleSpecificData: any = {};
        let roleSpecificTable = '';

        switch (role) {
          case 'child':
            roleSpecificData = {
              user_id: data.user.id,
              age: additionalData?.age || 0,
              skill_level: additionalData?.skill_level || 'beginner',
              timezone: additionalData?.timezone || 'UTC',
            };
            if (additionalData?.grade_level) roleSpecificData.grade_level = additionalData.grade_level;
            if (additionalData?.school_name) roleSpecificData.school_name = additionalData.school_name;
            roleSpecificTable = 'student_profiles';
            break;

          case 'guardian':
            roleSpecificData = {
              user_id: data.user.id,
              relationship: additionalData?.relationship || 'guardian',
            };
            if (additionalData?.occupation) roleSpecificData.occupation = additionalData.occupation;
            if (additionalData?.address) roleSpecificData.address = additionalData.address;
            roleSpecificTable = 'guardian_profiles';
            break;

          case 'instructor':
            roleSpecificData = {
              user_id: data.user.id,
              background_check: false,
            };
            if (additionalData?.bio) roleSpecificData.bio = additionalData.bio;
            if (additionalData?.specialization) roleSpecificData.specialization = additionalData.specialization;
            if (additionalData?.education) roleSpecificData.education = additionalData.education;
            if (additionalData?.years_of_experience) roleSpecificData.years_of_experience = additionalData.years_of_experience;
            roleSpecificTable = 'instructor_profiles';
            break;

          case 'admin':
            // Admins don't need additional profile data
            break;
        }

        if (roleSpecificTable && Object.keys(roleSpecificData).length > 0) {
          const { error: roleError } = await supabase
            .from(roleSpecificTable)
            .insert(roleSpecificData);

          if (roleError) {
            console.error('Error creating role-specific profile:', roleError);
          }
        }

        toast({
          title: "تم التسجيل بنجاح",
          description: "مرحباً بك في Starn Academy! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب",
        });
      }

      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء التسجيل",
      });
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً",
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
