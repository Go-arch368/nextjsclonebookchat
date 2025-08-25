'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/useUserStore';
interface Announcement {
  id?: number;
  userId: number;
  pageType: string;
  title: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

const AnnouncementsView = () => {
  const {user} = useUserStore()
  const { resolvedTheme } = useTheme();
  const [loginAnnouncements, setLoginAnnouncements] = useState<Announcement[]>([]);
  const [dashboardAnnouncements, setDashboardAnnouncements] = useState<Announcement[]>([]);
  const [loginForm, setLoginForm] = useState<Announcement>({
    userId: user?.id ?? 0,
    pageType: 'Login',
    title: '',
    text: '',
  });
  const [dashboardForm, setDashboardForm] = useState<Announcement>({
    userId: user?.id ?? 0,
    pageType: 'Dashboard',
    title: '',
    text: '',
  });
  const [editingId, setEditingId] = useState<{ [key: string]: number | null }>({
    Login: null,
    Dashboard: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/announcements');
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      
      const data: Announcement[] = await response.json();
       console.log(data);
       
      // Ensure data is always an array
      const announcements = Array.isArray(data) ? data : [];
      
      const loginAnns = announcements.filter(ann => ann.pageType === 'Login');
      const dashboardAnns = announcements.filter(ann => ann.pageType === 'Dashboard');

      setLoginAnnouncements(loginAnns);
      setDashboardAnnouncements(dashboardAnns);

      // Set the latest announcement for each page type
      if (loginAnns.length > 0) {
        const latestLogin = [...loginAnns].sort((a, b) =>
          new Date(b.updatedAt || b.createdAt || '').getTime() -
          new Date(a.updatedAt || a.createdAt || '').getTime()
        )[0];
        setLoginForm(latestLogin);
        setEditingId(prev => ({ ...prev, Login: latestLogin.id || null }));
      }

      if (dashboardAnns.length > 0) {
        const latestDashboard = [...dashboardAnns].sort((a, b) =>
          new Date(b.updatedAt || b.createdAt || '').getTime() -
          new Date(a.updatedAt || a.createdAt || '').getTime()
        )[0];
        setDashboardForm(latestDashboard);
        setEditingId(prev => ({ ...prev, Dashboard: latestDashboard.id || null }));
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load announcements');
      // Set empty arrays on error
      setLoginAnnouncements([]);
      setDashboardAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAnnouncement = async (form: Announcement, pageType: string) => {
    try {
      setIsSaving(true);
      
      if (!form.title || !form.text) {
        throw new Error('Title and text are required');
      }

      const method = editingId[pageType] ? 'PUT' : 'POST';
      const payload = {
        ...form,
        updatedAt: new Date().toISOString(),
        ...(editingId[pageType] && { id: editingId[pageType] }),
      };

      const response = await fetch('/api/settings/announcements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save announcement');
      }

      const savedAnnouncement = await response.json();
      
      toast.success(`Announcement ${editingId[pageType] ? 'updated' : 'saved'} successfully!`);
      await fetchAnnouncements();
      
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save announcement');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAnnouncement = async (id: number | null, pageType: string) => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/settings/announcements?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete announcement');
      }

      toast.success('Announcement deleted successfully!');
      
      // Reset form for this page type
      if (pageType === 'Login') {
        setLoginForm({
          userId: user?.id ?? 0,
          pageType: 'Login',
          title: '',
          text: '',
        });
      } else {
        setDashboardForm({
          userId: user?.id ?? 0,
          pageType: 'Dashboard',
          title: '',
          text: '',
        });
      }
      
      setEditingId(prev => ({ ...prev, [pageType]: null }));
      await fetchAnnouncements();
      
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (pageType: string) => {
    // This function is no longer needed since we're always in edit mode
  };

  const renderAnnouncementSection = (
    pageType: string,
    announcements: Announcement[],
    form: Announcement,
    setForm: React.Dispatch<React.SetStateAction<Announcement>>,
  ) => (
    <section className={`p-6 rounded-lg shadow-md mt-6 ${
      resolvedTheme === 'dark' 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-semibold ${
          resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Announcements for {pageType} Page
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => saveAnnouncement(form, pageType)}
            disabled={isSaving || isLoading}
            className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-full ${
              resolvedTheme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600'
                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : editingId[pageType] ? 'Update' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <label htmlFor={`${pageType}-title`} className={`block text-sm font-medium mb-2 ${
            resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Title
          </label>
          <div className="flex items-center gap-4">
            <input
              type="text"
              id={`${pageType}-title`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={isSaving || isLoading}
              className={`flex-grow p-2 rounded-md focus:outline-none focus:ring-2 ${
                resolvedTheme === 'dark'
                  ? 'bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 disabled:bg-gray-600'
                  : 'bg-white border border-gray-300 text-black focus:ring-blue-500 disabled:bg-gray-100'
              }`}
              placeholder="Enter announcement title"
            />
            <div className="flex gap-2">
              {editingId[pageType] && (
                <button 
                  onClick={() => deleteAnnouncement(editingId[pageType], pageType)}
                  disabled={isSaving || isLoading}
                  aria-label={`Delete ${pageType} announcement`}
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <Trash2 className={`h-5 w-5 ${
                    resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'
                  } ${isSaving || isLoading ? 'opacity-50' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div>
          <label htmlFor={`${pageType}-text`} className={`block text-sm font-medium mb-2 ${
            resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Text
          </label>
          <textarea
            id={`${pageType}-text`}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            disabled={isSaving || isLoading}
            className={`w-full p-2 rounded-md focus:outline-none focus:ring-2 h-32 ${
              resolvedTheme === 'dark'
                ? 'bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 disabled:bg-gray-600'
                : 'bg-white border border-gray-300 text-black focus:ring-blue-500 disabled:bg-gray-100'
            }`}
            placeholder="Enter announcement text"
          />
        </div>
      </div>

      {announcements.length > 1 && (
        <div className="mt-4">
          <h3 className={`text-sm font-medium mb-2 ${
            resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Previous Announcements:
          </h3>
          <div className="space-y-2">
            {announcements
              .filter(ann => ann.id !== editingId[pageType])
              .map(ann => (
                <div key={ann.id} className={`p-2 rounded ${
                  resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <p className="font-medium">{ann.title}</p>
                  <p className="text-sm opacity-75">{ann.text}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );

  if (isLoading && loginAnnouncements.length === 0 && dashboardAnnouncements.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4">
      {renderAnnouncementSection('Login', loginAnnouncements, loginForm, setLoginForm)}
      {renderAnnouncementSection('Dashboard', dashboardAnnouncements, dashboardForm, setDashboardForm)}
    </div>
  );
};

export default AnnouncementsView;