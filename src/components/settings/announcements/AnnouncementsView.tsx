'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useTheme } from 'next-themes';

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
  const { resolvedTheme } = useTheme();
  const [loginAnnouncements, setLoginAnnouncements] = useState<Announcement[]>([]);
  const [dashboardAnnouncements, setDashboardAnnouncements] = useState<Announcement[]>([]);
  const [loginForm, setLoginForm] = useState<Announcement>({
    userId: 1,
    pageType: 'Login',
    title: '',
    text: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [dashboardForm, setDashboardForm] = useState<Announcement>({
    userId: 1,
    pageType: 'Dashboard',
    title: '',
    text: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [editingId, setEditingId] = useState<{ [key: string]: number | null }>({
    Login: null,
    Dashboard: null,
  });
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({
    Login: true,
    Dashboard: true,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/settings/announcements');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch announcements');
      }
      const data: Announcement[] = await response.json();
      
      const loginAnns = data.filter(ann => ann.pageType === 'Login');
      const dashboardAnns = data.filter(ann => ann.pageType === 'Dashboard');

      setLoginAnnouncements(loginAnns);
      setDashboardAnnouncements(dashboardAnns);

      if (loginAnns.length > 0) {
        const latestLogin = [...loginAnns].sort((a, b) =>
          new Date(b.updatedAt || b.createdAt || '').getTime() -
          new Date(a.updatedAt || a.createdAt || '').getTime()
        )[0];
        setLoginForm({
          ...latestLogin,
          createdAt: latestLogin.createdAt || new Date().toISOString(),
          updatedAt: latestLogin.updatedAt || new Date().toISOString(),
        });
        setEditingId(prev => ({ ...prev, Login: latestLogin.id || null }));
        setIsEditing(prev => ({ ...prev, Login: false }));
      }

      if (dashboardAnns.length > 0) {
        const latestDashboard = [...dashboardAnns].sort((a, b) =>
          new Date(b.updatedAt || b.createdAt || '').getTime() -
          new Date(a.updatedAt || a.createdAt || '').getTime()
        )[0];
        setDashboardForm({
          ...latestDashboard,
          createdAt: latestDashboard.createdAt || new Date().toISOString(),
          updatedAt: latestDashboard.updatedAt || new Date().toISOString(),
        });
        setEditingId(prev => ({ ...prev, Dashboard: latestDashboard.id || null }));
        setIsEditing(prev => ({ ...prev, Dashboard: false }));
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const saveAnnouncement = async (form: Announcement) => {
    try {
      if (!form.title || !form.text) {
        throw new Error('Title and text are required');
      }

      const method = editingId[form.pageType] ? 'PUT' : 'POST';
      const payload = {
        userId: form.userId,
        pageType: form.pageType,
        title: form.title,
        text: form.text,
        createdAt: form.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(editingId[form.pageType] && { id: editingId[form.pageType] }),
      };

      const response = await fetch('/api/settings/announcements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save announcement');
      }

      setIsEditing(prev => ({ ...prev, [form.pageType]: false }));
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Save error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const deleteAnnouncement = async (id: number | null, pageType: string) => {
    if (!id) return;
    
    try {
      const response = await fetch(`/api/settings/announcements?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete announcement');
      }

      setIsEditing(prev => ({ ...prev, [pageType]: true }));
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const startEditing = (pageType: string) => {
    setIsEditing(prev => ({ ...prev, [pageType]: true }));
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
        <h2 className={`text-3xl font-bold ${
          resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Announcements for {pageType} Page
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => saveAnnouncement(form)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              resolvedTheme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>{editingId[pageType] ? 'Update' : 'Save'}</span>
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
              className={`flex-grow p-2 rounded-md focus:outline-none focus:ring-2 ${
                resolvedTheme === 'dark'
                  ? 'bg-gray-700 border border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border border-gray-300 text-black focus:ring-blue-500'
              }`}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => startEditing(pageType)}
                aria-label={`Edit ${pageType} announcement`}
              >
                <Edit2 className={`h-5 w-5 ${
                  resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </button>
              {editingId[pageType] && (
                <button 
                  onClick={() => deleteAnnouncement(editingId[pageType], pageType)}
                  aria-label={`Delete ${pageType} announcement`}
                >
                  <Trash2 className={`h-5 w-5 ${
                    resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`} />
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
            className={`w-full p-2 rounded-md focus:outline-none focus:ring-2 h-32 ${
              resolvedTheme === 'dark'
                ? 'bg-gray-700 border border-gray-600 text-white focus:ring-blue-500'
                : 'bg-white border border-gray-300 text-black focus:ring-blue-500'
            }`}
          />
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-10">
      {renderAnnouncementSection('Login', loginAnnouncements, loginForm, setLoginForm)}
      {renderAnnouncementSection('Dashboard', dashboardAnnouncements, dashboardForm, setDashboardForm)}
    </div>
  );
};

export default AnnouncementsView;