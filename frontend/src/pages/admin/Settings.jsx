import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateSettings } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const SettingsPage = () => {
  const { settings, loading, fetchSettings } = useSettings();
  const [form, setForm] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        restaurantName: settings.restaurantName || '',
        description: settings.description || '',
        themeColor: settings.themeColor || '#d97706',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        googleMapsUrl: settings.googleMapsUrl || '',
        currency: settings.currency || 'ETB',
        vatPercentage: settings.vatPercentage ?? 15,
        serviceChargePercentage: settings.serviceChargePercentage ?? 10,
        openingHours: { ...settings.openingHours },
        socialLinks: { ...settings.socialLinks },
        languages: settings.languages || ['en', 'am'],
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (typeof val === 'object') data.append(key, JSON.stringify(val));
        else data.append(key, val);
      });
      if (logoFile) data.append('logo', logoFile);
      if (coverFile) data.append('coverImage', coverFile);

      await updateSettings(data);
      await fetchSettings();
      toast.success('Settings saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Restaurant Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-lg">General</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Restaurant Name</label>
            <input className="input-field" value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="input-field h-24 resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Theme Color</label>
              <input type="color" className="input-field h-12" value={form.themeColor} onChange={(e) => setForm({ ...form, themeColor: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <input className="input-field" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Logo</label>
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="input-field" />
              {settings?.logo && <img src={settings.logo} alt="Logo" className="mt-2 w-16 h-16 rounded-full object-cover" />}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="input-field" />
              {settings?.coverImage && <img src={settings.coverImage} alt="Cover" className="mt-2 w-full h-20 rounded-lg object-cover" />}
            </div>
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-lg">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Google Maps URL</label>
            <input className="input-field" value={form.googleMapsUrl} onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })} />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-lg">Billing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">VAT (%)</label>
              <input type="number" className="input-field" value={form.vatPercentage} onChange={(e) => setForm({ ...form, vatPercentage: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service Charge (%)</label>
              <input type="number" className="input-field" value={form.serviceChargePercentage} onChange={(e) => setForm({ ...form, serviceChargePercentage: e.target.value })} />
            </div>
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-lg">Opening Hours</h2>
          {days.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-28 capitalize text-sm text-gray-500">{day}</span>
              <input
                className="input-field flex-1"
                value={form.openingHours[day] || ''}
                onChange={(e) => setForm({
                  ...form,
                  openingHours: { ...form.openingHours, [day]: e.target.value },
                })}
              />
            </div>
          ))}
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-lg">Social Links</h2>
          {['facebook', 'instagram', 'twitter', 'tiktok'].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium mb-1 capitalize">{platform}</label>
              <input
                className="input-field"
                value={form.socialLinks[platform] || ''}
                onChange={(e) => setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, [platform]: e.target.value },
                })}
              />
            </div>
          ))}
        </section>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
