import React, { useState, Component } from 'react';
import {
  Sun,
  CloudRain,
  Cloud,
  Wind,
  Plus,
  Calendar,
  Users,
  Camera } from
'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import {
  TextInput,
  TextareaInput,
  SelectInput } from
'../components/FormElements';
import { PhotoGallery } from '../components/PhotoComponents';
interface DailyLogPageProps {
  projectId?: string;
  onNavigate: (page: string, id?: string) => void;
  embedded?: boolean;
  userRole?: 'contractor' | 'homeowner';
}
export function DailyLogPage({
  projectId,
  onNavigate,
  embedded = false,
  userRole = 'contractor'
}: DailyLogPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const isContractor = userRole === 'contractor';
  // Mock data
  const logs = [
  {
    id: 'log-1',
    date: 'Feb 05, 2025',
    weather: 'sunny',
    temp: '72°F',
    crewSize: 4,
    workPerformed:
    'Completed drywall installation in kitchen and living room. Started mudding and taping seams.',
    issues: 'None',
    photos: [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=300&q=80']

  },
  {
    id: 'log-2',
    date: 'Feb 04, 2025',
    weather: 'cloudy',
    temp: '65°F',
    crewSize: 3,
    workPerformed:
    'Installed insulation in all exterior walls. Inspection passed at 2pm.',
    issues: 'Lumber delivery was 2 hours late.',
    photos: [
    'https://images.unsplash.com/photo-1620626012053-1c167f7eb477?auto=format&fit=crop&w=300&q=80']

  }];

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'windy':
        return <Wind className="w-5 h-5 text-gray-400" />;
      default:
        return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };
  const handleCreate = () => {
    setIsCreating(false);
    // Logic to add log
  };
  const content =
  <div className="space-y-6">
      {!embedded && !isCreating &&
    <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Daily Logs</h2>
          {isContractor &&
      <PrimaryButton size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Daily Log
            </PrimaryButton>
      }
        </div>
    }

      {isCreating ?
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            New Daily Log
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Date" type="date" />
              <TextInput label="Crew Size" type="number" placeholder="0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectInput
            label="Weather"
            options={[
            {
              value: 'sunny',
              label: 'Sunny'
            },
            {
              value: 'cloudy',
              label: 'Cloudy'
            },
            {
              value: 'rainy',
              label: 'Rainy'
            },
            {
              value: 'windy',
              label: 'Windy'
            }]
            } />

              <TextInput label="Temperature" placeholder="e.g. 72°F" />
            </div>
            <TextareaInput
          label="Work Performed"
          placeholder="Describe work completed today..." />

            <TextareaInput
          label="Issues / Delays"
          placeholder="Any problems encountered?" />


            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload photos</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <SecondaryButton onClick={() => setIsCreating(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleCreate}>Save Log</PrimaryButton>
            </div>
          </div>
        </div> :

    <div className="space-y-6">
          {embedded && isContractor &&
      <div className="flex justify-end mb-2">
              <PrimaryButton size="sm" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Daily Log
              </PrimaryButton>
            </div>
      }

          {logs.map((log) =>
      <div
        key={log.id}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Calendar className="w-5 h-5 text-navy-900" />
                  {log.date}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    {getWeatherIcon(log.weather)}
                    <span>{log.temp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{log.crewSize} Workers</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">
                    Work Performed
                  </h4>
                  <p className="text-gray-700">{log.workPerformed}</p>
                </div>

                {log.issues && log.issues !== 'None' &&
          <div>
                    <h4 className="text-xs font-bold uppercase text-red-500 mb-1">
                      Issues / Delays
                    </h4>
                    <p className="text-gray-700">{log.issues}</p>
                  </div>
          }

                {log.photos && log.photos.length > 0 &&
          <div>
                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">
                      Photos
                    </h4>
                    <PhotoGallery photos={log.photos} />
                  </div>
          }
              </div>
            </div>
      )}
        </div>
    }
    </div>;

  if (embedded) return content;
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar
        title="Daily Logs"
        showBack
        onBack={() => onNavigate('project-detail', projectId)} />

      <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full">{content}</div>
    </div>);

}