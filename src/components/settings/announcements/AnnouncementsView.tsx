// AnnouncementsView.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Camera, Trash2, Edit2 } from 'lucide-react';

interface Announcement {
  id?: number;
  userId: number;
  pageType: string;
  title: string;
  text: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AnnouncementsView = () => {
  const [loginAnnouncements, setLoginAnnouncements] = useState<Announcement[]>([]);
  const [dashboardAnnouncements, setDashboardAnnouncements] = useState<Announcement[]>([]);
  const [loginForm, setLoginForm] = useState<Announcement>({
    userId: 1,
    pageType: 'Login',
    title: '',
    text: '',
    imageUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [dashboardForm, setDashboardForm] = useState<Announcement>({
    userId: 1,
    pageType: 'Dashboard',
    title: '',
    text: '',
    imageUrl: '',
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
      } else {
        setLoginForm({
          userId: 1,
          pageType: 'Login',
          title: '',
          text: '',
          imageUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setEditingId(prev => ({ ...prev, Login: null }));
        setIsEditing(prev => ({ ...prev, Login: true }));
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
      } else {
        setDashboardForm({
          userId: 1,
          pageType: 'Dashboard',
          title: '',
          text: '',
          imageUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setEditingId(prev => ({ ...prev, Dashboard: null }));
        setIsEditing(prev => ({ ...prev, Dashboard: true }));
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setForm: React.Dispatch<React.SetStateAction<Announcement>>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, imageUrl }));
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
        imageUrl: form.imageUrl || '',
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

  const deleteAnnouncement = async (id: number, pageType: string) => {
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
    <section className="p-6 bg-white rounded-lg shadow-md border border-gray-200 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Announcements for {pageType} Page
        </h2>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 flex items-center gap-2"
            onClick={() => saveAnnouncement(form)}
          >
            <Plus className="h-5 w-5" />
            <span>{editingId[pageType] ? 'Update' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <label htmlFor={`${pageType}-title`} className="block text-black text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id={`${pageType}-title`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-[600px] p-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <div className="absolute right-2 top-10 flex gap-2">
              <button onClick={() => startEditing(pageType)}>
                <Edit2 className="h-5 w-5 text-gray-700" />
              </button>
              {editingId[pageType] && (
                <button onClick={() => deleteAnnouncement(editingId[pageType]!, pageType)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <label htmlFor={`${pageType}-text`} className="block text-black text-sm font-medium mb-2">
              Text
            </label>
            <textarea
              id={`${pageType}-text`}
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-[600px] p-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`image-upload-${pageType}`} className="block text-black text-sm font-medium mb-2">
            Image Upload
          </label>
          <div className="flex items-center gap-4">
            <label
              htmlFor={`image-upload-${pageType}`}
              className="px-6 py-4 bg-gray-200 text-gray-700 w-[180px] h-[180px] rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-300 cursor-pointer"
            >
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
            </label>
            {form.imageUrl && (
              <button
                onClick={() => setForm({ ...form, imageUrl: '' })}
                className="p-2 bg-red-200 text-red-700 rounded-lg hover行為:bg-red-300"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          <input
            type="file"
            id={`image-upload-${pageType}`}
            accept="image/*"
            className="hidden"

            onChange={(e) => handleImageUpload(e, setForm)}
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