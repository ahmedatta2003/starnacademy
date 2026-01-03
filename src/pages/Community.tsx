import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Image as ImageIcon, 
  Users, 
  MessageSquare,
  Sparkles,
  Star,
  Rocket,
  ArrowRight,
  Plus,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import Header from '@/components/Header';

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    role: string;
  };
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface ChatRoom {
  id: string;
  name: string | null;
  is_group: boolean;
  last_message?: string;
  other_user?: {
    full_name: string;
    avatar_url: string | null;
    role: string;
  };
}

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

const Community = () => {
  const { user, loading: authLoading, profile } = useAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [postingLoading, setPostingLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(true);
  
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [trainers, setTrainers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchChatRooms();
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost);
    }
  }, [selectedPost]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom);
      
      const channel = supabase
        .channel(`room-${selectedRoom}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `room_id=eq.${selectedRoom}`
          },
          async (payload) => {
            const { data: newMsg } = await supabase
              .from('chat_messages')
              .select('*, profiles:user_id(full_name, avatar_url)')
              .eq('id', payload.new.id)
              .single();
            
            if (newMsg) {
              setMessages(prev => [...prev, newMsg as ChatMessage]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedRoom]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data: postsData, error } = await supabase
        .from('community_posts')
        .select('*, profiles:user_id(full_name, avatar_url, role)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithCounts = await Promise.all(
        (postsData || []).map(async (post) => {
          const { count: likesCount } = await supabase
            .from('community_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          const { count: commentsCount } = await supabase
            .from('community_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          const { data: userLike } = await supabase
            .from('community_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', user?.id)
            .maybeSingle();

          return {
            ...post,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            is_liked: !!userLike
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('community_comments')
      .select('*, profiles:user_id(full_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  };

  const fetchChatRooms = async () => {
    const { data: participants } = await supabase
      .from('chat_participants')
      .select('room_id')
      .eq('user_id', user?.id);

    if (participants && participants.length > 0) {
      const roomIds = participants.map(p => p.room_id);
      
      const { data: rooms } = await supabase
        .from('chat_rooms')
        .select('*')
        .in('id', roomIds);

      if (rooms) {
        const roomsWithDetails = await Promise.all(
          rooms.map(async (room) => {
            const { data: otherParticipants } = await supabase
              .from('chat_participants')
              .select('user_id, profiles:user_id(full_name, avatar_url, role)')
              .eq('room_id', room.id)
              .neq('user_id', user?.id)
              .limit(1);

            return {
              ...room,
              other_user: otherParticipants?.[0]?.profiles
            };
          })
        );
        setChatRooms(roomsWithDetails);
      }
    }
  };

  const fetchUsers = async () => {
    const { data: trainerData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'trainer');

    const { data: studentData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'child')
      .neq('id', user?.id);

    setTrainers(trainerData || []);
    setStudents(studentData || []);
  };

  const fetchMessages = async (roomId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, profiles:user_id(full_name, avatar_url)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setPostingLoading(true);
    try {
      let imageUrl = null;
      
      if (newPostImage) {
        const fileExt = newPostImage.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('uploads')
          .upload(`community/${fileName}`, newPostImage);

        if (uploadError) throw uploadError;
        
        const { data: publicUrl } = supabase.storage
          .from('uploads')
          .getPublicUrl(`community/${fileName}`);
        
        imageUrl = publicUrl.publicUrl;
      }

      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user?.id,
          content: newPost,
          image_url: imageUrl
        });

      if (error) throw error;

      setNewPost('');
      setNewPostImage(null);
      fetchPosts();
      toast.success('تم نشر المنشور بنجاح! 🎉');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('حدث خطأ أثناء نشر المنشور');
    } finally {
      setPostingLoading(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await supabase
          .from('community_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user?.id);
      } else {
        await supabase
          .from('community_likes')
          .insert({ post_id: postId, user_id: user?.id });
      }
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user?.id,
          content: newComment
        });

      if (error) throw error;

      setNewComment('');
      fetchComments(postId);
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleStartChat = async (otherUserId: string) => {
    try {
      // Check if room already exists
      const { data: existingRooms } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', user?.id);

      if (existingRooms) {
        for (const room of existingRooms) {
          const { data: otherParticipant } = await supabase
            .from('chat_participants')
            .select('user_id')
            .eq('room_id', room.room_id)
            .eq('user_id', otherUserId)
            .maybeSingle();

          if (otherParticipant) {
            setSelectedRoom(room.room_id);
            setShowNewChatModal(false);
            return;
          }
        }
      }

      // Create new room
      const { data: newRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({ is_group: false })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add participants
      await supabase.from('chat_participants').insert([
        { room_id: newRoom.id, user_id: user?.id },
        { room_id: newRoom.id, user_id: otherUserId }
      ]);

      setSelectedRoom(newRoom.id);
      setShowNewChatModal(false);
      fetchChatRooms();
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('حدث خطأ أثناء إنشاء المحادثة');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: selectedRoom,
          user_id: user?.id,
          content: newMessage
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-primary font-semibold">مجتمع ستارن</span>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            🌟 مرحباً بك في مجتمعنا! 🌟
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            شارك أفكارك، اطرح أسئلتك، وتواصل مع زملائك ومدربيك في مكان واحد ممتع! 🚀
          </p>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-card shadow-lg rounded-full p-1">
            <TabsTrigger 
              value="posts" 
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              المنشورات
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              المحادثات
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            {/* Create Post Card */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
              <div className="flex gap-4">
                <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="شارك فكرة أو سؤال مع المجتمع... ✨"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px] resize-none border-2 border-primary/20 focus:border-primary bg-background/50"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
                        />
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 hover:bg-secondary/30 transition-colors">
                          <ImageIcon className="w-5 h-5 text-secondary" />
                          <span className="text-sm">إضافة صورة</span>
                        </div>
                      </label>
                      {newPostImage && (
                        <Badge variant="secondary" className="gap-1">
                          {newPostImage.name}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => setNewPostImage(null)}
                          />
                        </Badge>
                      )}
                    </div>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() || postingLoading}
                      className="rounded-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      <Rocket className="w-4 h-4" />
                      {postingLoading ? 'جاري النشر...' : 'نشر'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Posts List */}
            {loadingPosts ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : posts.length === 0 ? (
              <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
                <Sparkles className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">لا توجد منشورات بعد</h3>
                <p className="text-muted-foreground">كن أول من يشارك في المجتمع! 🌟</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="overflow-hidden bg-card/80 backdrop-blur-sm border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                          <AvatarImage src={post.profiles?.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {post.profiles?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{post.profiles?.full_name}</span>
                            {post.profiles?.role === 'trainer' && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                                👨‍🏫 مدرب
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ar })}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>

                      {post.image_url && (
                        <div className="mt-4 rounded-xl overflow-hidden">
                          <img 
                            src={post.image_url} 
                            alt="Post image" 
                            className="w-full max-h-96 object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border/50">
                        <button
                          onClick={() => handleLike(post.id, post.is_liked)}
                          className={`flex items-center gap-2 transition-all duration-300 hover:scale-110 ${
                            post.is_liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-6 h-6 ${post.is_liked ? 'fill-current' : ''}`} />
                          <span className="font-medium">{post.likes_count}</span>
                        </button>
                        <button
                          onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                        >
                          <MessageCircle className="w-6 h-6" />
                          <span className="font-medium">{post.comments_count}</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {selectedPost === post.id && (
                        <div className="mt-6 pt-4 border-t border-border/50 space-y-4">
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={profile?.avatar_url} />
                              <AvatarFallback className="bg-primary/20 text-primary text-sm">
                                {profile?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Input
                                placeholder="اكتب تعليقاً..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                className="flex-1"
                              />
                              <Button 
                                size="icon" 
                                onClick={() => handleAddComment(post.id)}
                                className="shrink-0"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3 bg-muted/30 rounded-lg p-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={comment.profiles?.avatar_url || ''} />
                                  <AvatarFallback className="bg-secondary/20 text-secondary text-sm">
                                    {comment.profiles?.full_name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{comment.profiles?.full_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ar })}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <div className="grid md:grid-cols-3 gap-6 h-[600px]">
              {/* Chat List */}
              <Card className="md:col-span-1 bg-card/80 backdrop-blur-sm border-2 border-primary/20 overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    المحادثات
                  </h3>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setShowNewChatModal(true)}
                    className="rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100%-60px)]">
                  <div className="p-2 space-y-2">
                    {chatRooms.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>لا توجد محادثات بعد</p>
                        <Button 
                          variant="link" 
                          onClick={() => setShowNewChatModal(true)}
                          className="mt-2"
                        >
                          ابدأ محادثة جديدة
                        </Button>
                      </div>
                    ) : (
                      chatRooms.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoom(room.id)}
                          className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                            selectedRoom === room.id 
                              ? 'bg-primary/20 border-2 border-primary/40' 
                              : 'hover:bg-muted/50 border-2 border-transparent'
                          }`}
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={room.other_user?.avatar_url || ''} />
                            <AvatarFallback className="bg-secondary/20 text-secondary">
                              {room.other_user?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-right">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{room.other_user?.full_name || 'مستخدم'}</span>
                              {room.other_user?.role === 'trainer' && (
                                <Badge variant="secondary" className="text-xs">مدرب</Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </Card>

              {/* Chat Messages */}
              <Card className="md:col-span-2 bg-card/80 backdrop-blur-sm border-2 border-primary/20 flex flex-col overflow-hidden">
                {selectedRoom ? (
                  <>
                    <div className="p-4 border-b border-border/50 bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={chatRooms.find(r => r.id === selectedRoom)?.other_user?.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {chatRooms.find(r => r.id === selectedRoom)?.other_user?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">
                          {chatRooms.find(r => r.id === selectedRoom)?.other_user?.full_name || 'محادثة'}
                        </span>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                message.user_id === user?.id
                                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{message.content}</p>
                              <span className={`text-xs mt-1 block ${
                                message.user_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: ar })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t border-border/50">
                      <div className="flex gap-2">
                        <Input
                          placeholder="اكتب رسالتك..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} className="shrink-0">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                    <div>
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">اختر محادثة</h3>
                      <p>اختر محادثة من القائمة أو ابدأ محادثة جديدة</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 bg-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  محادثة جديدة
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowNewChatModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Tabs defaultValue="trainers" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="trainers">👨‍🏫 المدربين</TabsTrigger>
                  <TabsTrigger value="students">👩‍🎓 الطلاب</TabsTrigger>
                </TabsList>

                <TabsContent value="trainers">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {trainers.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">لا يوجد مدربين</p>
                      ) : (
                        trainers.map((trainer) => (
                          <button
                            key={trainer.id}
                            onClick={() => handleStartChat(trainer.id)}
                            className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-primary/20"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={trainer.avatar_url} />
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {trainer.full_name?.charAt(0) || 'T'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-right">
                              <span className="font-medium">{trainer.full_name}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="students">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {students.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">لا يوجد طلاب آخرين</p>
                      ) : (
                        students.map((student) => (
                          <button
                            key={student.id}
                            onClick={() => handleStartChat(student.id)}
                            className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-primary/20"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={student.avatar_url} />
                              <AvatarFallback className="bg-secondary/20 text-secondary">
                                {student.full_name?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-right">
                              <span className="font-medium">{student.full_name}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Community;
