import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Flag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Ban,
  MessageSquareWarning,
  ShieldAlert,
  HelpCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ContentReport {
  id: string;
  reporter_id: string;
  content_type: string;
  content_id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reporter?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface ReportedContent {
  type: string;
  content: string;
  author?: string;
}

const reasonLabels: Record<string, { label: string; icon: React.ElementType }> = {
  inappropriate: { label: 'محتوى غير لائق', icon: Ban },
  spam: { label: 'إعلان مزعج', icon: MessageSquareWarning },
  harassment: { label: 'تنمر أو إساءة', icon: ShieldAlert },
  violence: { label: 'عنف', icon: AlertTriangle },
  other: { label: 'سبب آخر', icon: HelpCircle },
};

const AdminReportsPanel = () => {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'dismissed'>('pending');
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [reportedContent, setReportedContent] = useState<ReportedContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch reporter profiles separately
      const reporterIds = [...new Set((data || []).map(r => r.reporter_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', reporterIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const reportsWithProfiles = (data || []).map(report => ({
        ...report,
        reporter: profilesMap.get(report.reporter_id) as { full_name: string; avatar_url: string | null } | undefined
      }));

      setReports(reportsWithProfiles);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('حدث خطأ في تحميل البلاغات');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportedContent = async (report: ContentReport) => {
    setLoadingContent(true);
    try {
      let content: ReportedContent | null = null;

      switch (report.content_type) {
        case 'post': {
          const { data } = await supabase
            .from('community_posts')
            .select('content, profiles:user_id(full_name)')
            .eq('id', report.content_id)
            .single();
          if (data) {
            content = {
              type: 'منشور',
              content: data.content,
              author: (data.profiles as any)?.full_name,
            };
          }
          break;
        }
        case 'comment': {
          const { data } = await supabase
            .from('community_comments')
            .select('content, profiles:user_id(full_name)')
            .eq('id', report.content_id)
            .single();
          if (data) {
            content = {
              type: 'تعليق',
              content: data.content,
              author: (data.profiles as any)?.full_name,
            };
          }
          break;
        }
        case 'message': {
          const { data } = await supabase
            .from('chat_messages')
            .select('content, profiles:user_id(full_name)')
            .eq('id', report.content_id)
            .single();
          if (data) {
            content = {
              type: 'رسالة خاصة',
              content: data.content,
              author: (data.profiles as any)?.full_name,
            };
          }
          break;
        }
      }

      setReportedContent(content);
    } catch (error) {
      console.error('Error fetching reported content:', error);
      setReportedContent(null);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleViewReport = async (report: ContentReport) => {
    setSelectedReport(report);
    setReportedContent(null);
    await fetchReportedContent(report);
  };

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('content_reports')
        .update({ 
          status, 
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) throw error;

      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status, reviewed_at: new Date().toISOString() } : r
      ));
      
      setSelectedReport(null);
      toast.success('تم تحديث حالة البلاغ بنجاح');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('حدث خطأ في تحديث البلاغ');
    }
  };

  const handleDeleteContent = async (report: ContentReport) => {
    if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟ هذا الإجراء لا يمكن التراجع عنه.')) return;

    try {
      let deleteError: Error | null = null;
      
      switch (report.content_type) {
        case 'post': {
          const { error } = await supabase
            .from('community_posts')
            .delete()
            .eq('id', report.content_id);
          if (error) deleteError = error;
          break;
        }
        case 'comment': {
          const { error } = await supabase
            .from('community_comments')
            .delete()
            .eq('id', report.content_id);
          if (error) deleteError = error;
          break;
        }
        case 'message': {
          const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('id', report.content_id);
          if (error) deleteError = error;
          break;
        }
      }

      if (deleteError) throw deleteError;

      await handleUpdateStatus(report.id, 'resolved');
      toast.success('تم حذف المحتوى وحل البلاغ');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('حدث خطأ في حذف المحتوى');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 ml-1" />تم الحل</Badge>;
      case 'dismissed':
        return <Badge variant="secondary"><XCircle className="h-3 w-3 ml-1" />مرفوض</Badge>;
      default:
        return <Badge variant="destructive"><Clock className="h-3 w-3 ml-1" />قيد المراجعة</Badge>;
    }
  };

  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'post':
        return <Badge variant="outline">منشور</Badge>;
      case 'comment':
        return <Badge variant="outline">تعليق</Badge>;
      case 'message':
        return <Badge variant="outline">رسالة</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'pending') return report.status === 'pending';
    if (filter === 'reviewed') return report.status === 'resolved';
    if (filter === 'dismissed') return report.status === 'dismissed';
    return true;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flag className="h-6 w-6 text-destructive" />
          <h2 className="text-2xl font-bold">إدارة البلاغات</h2>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {pendingCount} بلاغ جديد
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            قيد المراجعة ({reports.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            تم الحل ({reports.filter(r => r.status === 'resolved').length})
          </TabsTrigger>
          <TabsTrigger value="dismissed" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            مرفوض ({reports.filter(r => r.status === 'dismissed').length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            الكل ({reports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد بلاغات {filter === 'pending' ? 'قيد المراجعة' : ''}</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {filteredReports.map((report) => {
                  const ReasonIcon = reasonLabels[report.reason]?.icon || HelpCircle;
                  return (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={report.reporter?.avatar_url || ''} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {report.reporter?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{report.reporter?.full_name || 'مستخدم'}</span>
                                <span className="text-muted-foreground text-sm">
                                  أبلغ عن {getContentTypeBadge(report.content_type)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(report.status)}
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: ar })}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <ReasonIcon className="h-4 w-4 text-destructive" />
                              <span className="font-medium text-destructive">
                                {reasonLabels[report.reason]?.label || report.reason}
                              </span>
                            </div>

                            {report.description && (
                              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                                {report.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewReport(report)}
                              >
                                <Eye className="h-4 w-4 ml-1" />
                                عرض المحتوى
                              </Button>
                              {report.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleDeleteContent(report)}
                                  >
                                    <Trash2 className="h-4 w-4 ml-1" />
                                    حذف المحتوى
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="secondary"
                                    onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                                  >
                                    <XCircle className="h-4 w-4 ml-1" />
                                    رفض البلاغ
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {/* View Content Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              عرض المحتوى المُبلغ عنه
            </DialogTitle>
            <DialogDescription>
              {selectedReport && getContentTypeBadge(selectedReport.content_type)}
            </DialogDescription>
          </DialogHeader>

          {loadingContent ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reportedContent ? (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{reportedContent.type}</Badge>
                  {reportedContent.author && (
                    <span className="text-sm text-muted-foreground">
                      بواسطة: {reportedContent.author}
                    </span>
                  )}
                </div>
                <p className="text-sm">{reportedContent.content}</p>
              </div>

              {selectedReport && selectedReport.status === 'pending' && (
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="destructive"
                    onClick={() => handleDeleteContent(selectedReport)}
                  >
                    <Trash2 className="h-4 w-4 ml-1" />
                    حذف المحتوى
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                  >
                    <XCircle className="h-4 w-4 ml-1" />
                    رفض البلاغ
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>تم حذف هذا المحتوى أو لا يمكن العثور عليه</p>
              {selectedReport && selectedReport.status === 'pending' && (
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                >
                  تحديث كـ "تم الحل"
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReportsPanel;
