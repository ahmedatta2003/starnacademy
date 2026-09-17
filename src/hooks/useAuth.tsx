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
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
        return;
      }

      setProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setProfile(null);
          window.setTimeout(() => {
            void loadProfile(session.user.id);
          }, 0);
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
            phone: additionalData?.phone ?? null,
          },
        },
      });

      if (authError) {
        toast({
          variant: "destructive",
          title: "خطأ في التسجيل",
          description: authError.message.includes("already registered")
            ? "هذا البريد الإلكتروني مسجل بالفعل"
            : authError.message,
        });
        return { error: authError };
      }

      // The database creates the profile and role automatically on signup.
      // Only extra role-specific data is written here, and only when the user
      // already has an active session (i.e. email confirmation is not pending).
      if (data.user && data.session) {
        if (additionalData?.phone) {
          await supabase.from('profiles').update({ phone: additionalData.phone }).eq('id', data.user.id);
        }

        if (role === 'guardian') {
          const { error: guardianError } = await supabase.from('guardians').insert({
            user_id: data.user.id,
            occupation: additionalData?.occupation || null,
            address: additionalData?.address || null,
          });
          if (guardianError) console.error('Error creating guardian profile:', guardianError);
        }

        if (role === 'instructor') {
          const { error: trainerError } = await supabase.from('trainers').insert({
            user_id: data.user.id,
            bio: additionalData?.bio || null,
            specialization: additionalData?.specialization || null,
            education: additionalData?.education || null,
            years_of_experience: additionalData?.years_of_experience || null,
          });
          if (trainerError) console.error('Error creating trainer profile:', trainerError);
        }
      }

      toast({
        title: "تم التسجيل بنجاح",
        description: data.session
          ? "مرحباً بك في Starn Academy"
          : "مرحباً بك! يرجى تأكيد بريدك الإلكتروني من الرسالة المُرسلة إليك",
      });

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
