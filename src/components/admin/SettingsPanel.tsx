import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { debounce } from 'lodash';

function SettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);
  const [formValues, setFormValues] = useState({
    appName: '',
    supportEmail: '',
    supportPhone: '',
    currency: 'NGN',
    fare: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').limit(1).single();
  
      if (error) {
        console.error('❌ Failed to fetch settings:', error.message);
        setLoading(false);
        return;
      }
  
      if (data) {
        setFormValues({
          appName: data.app_name || '',
          supportEmail: data.support_email || '',
          supportPhone: data.support_phone || '',
          currency: data.currency || 'NGN',
          fare: Number(data.fare || 0),
        });
        setSettingsId(data.id);
      }
  
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error fetching settings:', err);
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    const validationErrors = {};
    
    switch (name) {
      case 'appName':
        if (!value.trim()) validationErrors.appName = "App name is required";
        break;
      case 'supportEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) validationErrors.supportEmail = "Enter a valid email";
        break;
      case 'supportPhone':
        if (value.trim().length < 7) validationErrors.supportPhone = "Phone number too short";
        break;
      case 'currency':
        if (!value.trim()) validationErrors.currency = "Currency is required";
        break;
      case 'fare':
        if (isNaN(value) || Number(value) < 0) validationErrors.fare = "Fare must be a positive number";
        break;
      default:
        break;
    }
    
    return validationErrors;
  };

  // Create a debounced update function (saves 300ms after user stops typing)
  const debouncedUpdate = debounce(async (name, value) => {
    try {
      // Don't update if there are validation errors for this field
      const fieldErrors = validateField(name, value);
      if (Object.keys(fieldErrors).length > 0) {
        return;
      }

      setSaving(true);
      
      // Convert from camelCase form field names to snake_case database fields
      const fieldMap = {
        appName: 'app_name',
        supportEmail: 'support_email',
        supportPhone: 'support_phone',
        currency: 'currency',
        fare: 'fare'
      };
      
      const dbField = fieldMap[name];
      
      // Prepare the update payload
      const payload = {
        [dbField]: name === 'fare' ? Number(value) : value,
        updated_at: new Date().toISOString()
      };
      
      console.log(`Updating ${dbField} to:`, payload[dbField]);
      
      let result;
      if (settingsId) {
        result = await supabase
          .from('settings')
          .update(payload)
          .eq('id', settingsId)
          .select();
      } else {
        // First-time insert if no settings exist yet
        result = await supabase
          .from('settings')
          .insert({ ...payload })
          .select();
          
        // Store the new ID if this was a first-time insert
        if (result.data && result.data[0]) {
          setSettingsId(result.data[0].id);
        }
      }
      
      if (result.error) {
        console.error('❌ Update error:', result.error);
      } else {
        console.log('✅ Field updated successfully:', name);
      }
    } catch (err) {
      console.error('Unexpected error updating settings:', err);
    } finally {
      setSaving(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? Number(value) : value;
    
    // Update local state immediately for responsive UI
    setFormValues(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Validate and set any errors
    const fieldErrors = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
    
    // If no validation errors for this field, queue the database update
    if (Object.keys(fieldErrors).length === 0) {
      debouncedUpdate(name, value);
    }
  };

  const saveAllSettings = async () => {
    // Validate all fields
    let allErrors = {};
    for (const [name, value] of Object.entries(formValues)) {
      const fieldErrors = validateField(name, value);
      allErrors = { ...allErrors, ...fieldErrors };
    }
    
    // If there are errors, update the error state and don't proceed
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    
    try {
      setSaving(true);
      
      const payload = {
        app_name: formValues.appName,
        support_email: formValues.supportEmail,
        support_phone: formValues.supportPhone,
        currency: formValues.currency,
        fare: formValues.fare,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      if (settingsId) {
        result = await supabase
          .from('settings')
          .update(payload)
          .eq('id', settingsId)
          .select();
      } else {
        result = await supabase
          .from('settings')
          .insert(payload)
          .select();
      }
      
      if (result.error) {
        console.error('❌ Save all settings error:', result.error);
        alert('Update failed. Please check the console for details.');
      } else {
        console.log('✅ All settings saved successfully');
        alert('All settings saved!');
      }
    } catch (err) {
      console.error('Unexpected error saving all settings:', err);
      alert('Update failed due to an unexpected error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Admin Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
          A
        </div>
        <div>
          <h2 className="text-xl font-semibold">Admin Settings</h2>
          <p className="text-gray-500 text-sm">Update your application configuration</p>
        </div>
        {saving && (
          <div className="ml-auto flex items-center text-primary">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm">Saving...</span>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'App Name', name: 'appName' },
              { label: 'Support Email', name: 'supportEmail', type: 'email' },
              { label: 'Support Phone', name: 'supportPhone' },
              { label: 'Currency', name: 'currency' },
              { label: 'Fare (₦)', name: 'fare', type: 'number' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formValues[field.name]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveAllSettings}
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg flex items-center hover:bg-opacity-90 transition"
            >
              <Save size={20} className="mr-2" />
              {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;