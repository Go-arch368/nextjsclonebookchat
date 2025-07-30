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
    Login: false,
    Dashboard: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: { title?: string; text?: string } }>({
    Login: {},
    Dashboard: {},
  });

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('https://zotly.onrender.com/settings/announcements/list');
      if (!response.ok) {
        throw new Error(`Failed to fetch announcements: ${response.statusText}`);
      }
      const data: Announcement[] = await response.json();
      const loginAnns = data.filter((ann) => ann.pageType === 'Login');
      const dashboardAnns = data.filter((ann) => ann.pageType === 'Dashboard');

      setLoginAnnouncements(loginAnns);
      setDashboardAnnouncements(dashboardAnns);

      // Set the most recent announcement in the input boxes
      if (loginAnns.length > 0) {
        const latestLogin = loginAnns.sort((a, b) =>
          new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
        )[0];
        setLoginForm({
          userId: 1,
          pageType: 'Login',
          title: latestLogin.title,
          text: latestLogin.text,
          imageUrl: latestLogin.imageUrl || '',
          createdAt: latestLogin.createdAt || new Date().toISOString(),
          updatedAt: latestLogin.updatedAt || new Date().toISOString(),
        });
        setEditingId((prev) => ({ ...prev, Login: latestLogin.id || null }));
        setIsEditing((prev) => ({ ...prev, Login: false }));
        setErrors((prev) => ({ ...prev, Login: {} }));
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
        setEditingId((prev) => ({ ...prev, Login: null }));
        setIsEditing((prev) => ({ ...prev, Login: true }));
        setErrors((prev) => ({ ...prev, Login: {} }));
      }

      if (dashboardAnns.length > 0) {
        const latestDashboard = dashboardAnns.sort((a, b) =>
          new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
        )[0];
        setDashboardForm({
          userId: 1,
          pageType: 'Dashboard',
          title: latestDashboard.title,
          text: latestDashboard.text,
          imageUrl: latestDashboard.imageUrl || '',
          createdAt: latestDashboard.createdAt || new Date().toISOString(),
          updatedAt: latestDashboard.updatedAt || new Date().toISOString(),
        });
        setEditingId((prev) => ({ ...prev, Dashboard: latestDashboard.id || null }));
        setIsEditing((prev) => ({ ...prev, Dashboard: false }));
        setErrors((prev) => ({ ...prev, Dashboard: {} }));
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
        setEditingId((prev) => ({ ...prev, Dashboard: null }));
        setIsEditing((prev) => ({ ...prev, Dashboard: true }));
        setErrors((prev) => ({ ...prev, Dashboard: {} }));
      }
    } catch (error: any) {
      console.error('Error fetching announcements:', error.message);
      alert(`Error fetching announcements: ${error.message}`);
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setForm: React.Dispatch<React.SetStateAction<Announcement>>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Placeholder: API expects a URL, so we need an upload endpoint
      alert('Image upload not implemented. Please provide an image upload endpoint to generate a URL.');
      setForm((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const validateForm = (form: Announcement) => {
    const newErrors: { title?: string; text?: string } = {};
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!form.text.trim()) {
      newErrors.text = 'Text is required';
    }
    return newErrors;
  };

  const saveAnnouncement = async (form: Announcement) => {
    // Validate form data
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [form.pageType]: validationErrors }));
      return;
    }

    try {
      const url = editingId[form.pageType]
        ? `https://zotly.onrender.com/settings/announcements/update`
        : `https://zotly.onrender.com/settings/announcements/save`;
      const method = editingId[form.pageType] ? 'PUT' : 'POST';

      // Prepare payload matching the schema
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

      // Log the request data for debugging
      console.log('Saving announcement:', { url, method, payload });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if required, e.g.:
          // 'Authorization': `Bearer ${yourToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Error ${response.status}: ${response.statusText}`, errorData);
        throw new Error(`Failed to save announcement: ${response.statusText}`);
      }

      console.log('Announcement saved successfully');
      setIsEditing((prev) => ({ ...prev, [form.pageType]: false }));
      setErrors((prev) => ({ ...prev, [form.pageType]: {} }));
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Error saving announcement:', error.message, error);
      alert(`Error saving announcement: ${error.message}`);
    }
  };

  const deleteAnnouncement = async (id: number, pageType: string) => {
    try {
      const response = await fetch(
        `https://zotly.onrender.com/settings/announcements/delete/${id}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        throw new Error(`Failed to delete announcement: ${response.statusText}`);
      }
      setIsEditing((prev) => ({ ...prev, [pageType]: true }));
      setErrors((prev) => ({ ...prev, [pageType]: {} }));
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Error deleting announcement:', error.message);
      alert(`Error deleting announcement: ${error.message}`);
    }
  };

  const clearAnnouncements = async () => {
    try {
      const response = await fetch('https://zotly.onrender.com/settings/announcements/clear', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to clear announcements: ${response.statusText}`);
      }
      setIsEditing({ Login: true, Dashboard: true });
      setErrors({ Login: {}, Dashboard: {} });
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Error clearing announcements:', error.message);
      alert(`Error clearing announcements: ${error.message}`);
    }
  };

  const startEditing = (pageType: string) => {
    setIsEditing((prev) => ({ ...prev, [pageType]: true }));
    setErrors((prev) => ({ ...prev, [pageType]: {} }));
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
            <span>{editingId[pageType] && isEditing[pageType] ? 'Update' : 'Save'}</span>
          </button>
          <button
            className="px-4 py-2 bg-red-200 text-red-700 rounded-full hover:bg-red-300 flex items-center gap-2"
            onClick={clearAnnouncements}
          >
            <Trash2 className="h-5 w-5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <hr className="border-t border-gray-300 mb-10" />

      {/* Original bg-gray-900 box, unchanged */}
      <div className={`p-4 border bg-gray-900 rounded-lg ${pageType === 'Login' ? 'w-[350px]' : 'w-fit'} mb-6`}>
        <p className={`text-white ${pageType === 'Login' ? 'text-lg leading-relaxed' : 'text-5xl p-5 leading-tight'}`}>
          Welcome to Zotly {pageType === 'Login' ? 'Beta Testings.' : 'Beta'}
        </p>
        <span className="text-sm text-gray-400 px-5 pb-3 block">
          For any feedback please email me directly at{' '}
          <a href="mailto:terry@chatmetrics.com" className="underline">
            terry@chatmetrics.com
          </a>{' '}
          or request to join our Zotly-Beta Slack Channel.
        </span>
      </div>

      {/* Form for adding/editing announcements */}
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
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setErrors((prev) => ({ ...prev, [pageType]: { ...prev[pageType], title: '' } }));
              }}
              disabled={!isEditing[pageType]}
              className={`w-[600px] p-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-500 ${!isEditing[pageType] ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors[pageType]?.title ? 'border-red-500' : ''}`}
            />
            {errors[pageType]?.title && (
              <p className="text-red-500 text-sm mt-1">{errors[pageType].title}</p>
            )}
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
              onChange={(e) => {
                setForm({ ...form, text: e.target.value });
                setErrors((prev) => ({ ...prev, [pageType]: { ...prev[pageType], text: '' } }));
              }}
              disabled={!isEditing[pageType]}
              className={`w-[600px] p-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-500 ${!isEditing[pageType] ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors[pageType]?.text ? 'border-red-500' : ''}`}
            />
            {errors[pageType]?.text && (
              <p className="text-red-500 text-sm mt-1">{errors[pageType].text}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor={`image-upload-${pageType}`} className="block text-black text-sm font-medium mb-2">
            Image Upload
          </label>
          <input
            type="file"
            id={`image-upload-${pageType}`}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e, setForm)}
            disabled={!isEditing[pageType]}
          />
          <label
            htmlFor={`image-upload-${pageType}`}
            className={`px-6 py-4 bg-gray-200 text-gray-700 w-[180px] h-[180px] rounded-lg flex flex-col items-center justify-center gap-2 ${!isEditing[pageType] ? 'cursor-not-allowed' : 'hover:bg-gray-300 cursor-pointer'}`}
          >
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="flex gap-4">
                <Camera className="h-5 w-5" />
                <Trash2 className="h-5 w-5" />
              </div>
            )}
          </label>
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