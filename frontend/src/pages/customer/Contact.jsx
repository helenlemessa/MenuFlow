import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const Contact = () => {
  const { settings } = useSettings();

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold mb-8">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {settings?.address && (
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-600 dark:text-gray-400">{settings.address}</p>
                  {settings.googleMapsUrl && (
                    <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm hover:underline mt-1 inline-block">
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}
            {settings?.phone && (
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href={`tel:${settings.phone}`} className="text-gray-600 dark:text-gray-400 hover:text-primary-600">{settings.phone}</a>
                </div>
              </div>
            )}
            {settings?.email && (
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href={`mailto:${settings.email}`} className="text-gray-600 dark:text-gray-400 hover:text-primary-600">{settings.email}</a>
                </div>
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-primary-600" />
              <h3 className="font-semibold text-lg">Opening Hours</h3>
            </div>
            <div className="space-y-2">
              {days.map((day) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-500">{day}</span>
                  <span className="font-medium">{settings?.openingHours?.[day] || 'Closed'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {settings?.googleMapsUrl && (
          <div className="mt-8 rounded-2xl overflow-hidden h-64">
            <iframe
              title="Location"
              src={settings.googleMapsUrl.replace('?q=', '/embed?pb=&q=')}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Contact;
