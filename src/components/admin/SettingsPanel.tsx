import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';

const settingsSchema = z.object({
  baseFare: z.number().min(0),
  perKmRate: z.number().min(0),
  minimumFare: z.number().min(0),
  maxDistance: z.number().min(1),
  referralBonus: z.number().min(0),
  commissionRate: z.number().min(0).max(100),
});

function SettingsPanel() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      baseFare: 50,
      perKmRate: 10,
      minimumFare: 30,
      maxDistance: 20,
      referralBonus: 100,
      commissionRate: 15,
    },
  });

  const onSubmit = (data: any) => {
    console.log('Settings updated:', data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Fare (₦)
              </label>
              <input
                type="number"
                {...register('baseFare', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.baseFare && (
                <p className="text-red-500 text-sm mt-1">{errors.baseFare.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Per Kilometer Rate (₦)
              </label>
              <input
                type="number"
                {...register('perKmRate', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.perKmRate && (
                <p className="text-red-500 text-sm mt-1">{errors.perKmRate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Fare (₦)
              </label>
              <input
                type="number"
                {...register('minimumFare', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.minimumFare && (
                <p className="text-red-500 text-sm mt-1">{errors.minimumFare.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Distance (km)
              </label>
              <input
                type="number"
                {...register('maxDistance', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.maxDistance && (
                <p className="text-red-500 text-sm mt-1">{errors.maxDistance.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referral Bonus (₦)
              </label>
              <input
                type="number"
                {...register('referralBonus', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.referralBonus && (
                <p className="text-red-500 text-sm mt-1">{errors.referralBonus.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <input
                type="number"
                {...register('commissionRate', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.commissionRate && (
                <p className="text-red-500 text-sm mt-1">{errors.commissionRate.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg flex items-center hover:bg-opacity-90 transition"
            >
              <Save size={20} className="mr-2" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPanel;