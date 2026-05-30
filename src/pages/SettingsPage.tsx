import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/Select';
import { useSettingsStore } from '../store/settingsstore';
import { useToastStore } from '../components/ui/Toast';
import { useFleetStore } from '../store/fleetStore';
import { 
  Settings, Sliders, Shield, RefreshCw, 
  ToggleLeft, ToggleRight, Sparkles 
} from 'lucide-react';
import { mockVehicles } from '../data/mockVehicles';
import { mockDrivers } from '../data/mockDrivers';
import { mockRequests } from '../data/mockRequests';
import { mockAssignments } from '../data/mockAssignments';

export const SettingsPage = () => {
  const { 
    autoOptimize, notifyOnNewRequest, notifyOnDelay, 
    maintenanceThresholdKm, currency, updateSettings 
  } = useSettingsStore();

  const { showToast } = useToastStore();

  const [maintenanceKm, setMaintenanceKm] = useState(maintenanceThresholdKm);
  const [currencyCode, setCurrencyCode] = useState(currency);
  const [resetting, setResetting] = useState(false);

  const handleSave = () => {
    updateSettings({
      maintenanceThresholdKm: Number(maintenanceKm),
      currency: currencyCode
    });
    showToast('Operational parameters updated successfully', 'success');
  };

  const handleResetDatabase = async () => {
    setResetting(true);
    // Simulate API reload
    await new Promise(r => setTimeout(r, 1200));

    // Reload store mock records
    useFleetStore.setState({
      vehicles: mockVehicles,
      drivers: mockDrivers,
      requests: mockRequests,
      assignments: mockAssignments
    });

    setResetting(false);
    showToast('Database reset to defaults successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">System Configurations</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure backend optimization parameters and user dashboard behaviors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar settings shortcuts */}
        <div className="space-y-3">
          <Card className="bg-slate-50 dark:bg-slate-900/40 p-1 divide-y divide-slate-100 dark:divide-slate-800 border-slate-200/50">
            <button className="w-full flex items-center px-4 py-3 text-sm font-semibold text-brand-blue bg-white dark:bg-slate-900 rounded-lg shadow-sm">
              <Sliders className="h-4 w-4 mr-3 text-brand-blue" />
              <span>Operational Models</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors">
              <Shield className="h-4 w-4 mr-3" />
              <span>Privacy & Roles</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors">
              <Settings className="h-4 w-4 mr-3" />
              <span>Advanced System Logs</span>
            </button>
          </Card>
        </div>

        {/* Configurations detail panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Optimization parameters card */}
          <Card>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Operational Models</h2>
              <p className="text-xs text-gray-500">Configure core dispatching parameters</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Auto Dispatch Optimizer Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Autonomous Dispatches</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Let RouteIQ AI assign incoming transit requests automatically when idle capacity is detected.</p>
                </div>
                <button 
                  onClick={() => updateSettings({ autoOptimize: !autoOptimize })}
                  className="focus:outline-none"
                >
                  {autoOptimize ? (
                    <ToggleRight className="h-10 w-10 text-brand-blue" />
                  ) : (
                    <ToggleLeft className="h-10 w-10 text-gray-400" />
                  )}
                </button>
              </div>

              {/* SMS Dispatch Alerts */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">SMS Driver Push Alerts</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Notify drivers automatically via SMS when they are assigned a route.</p>
                </div>
                <button 
                  onClick={() => updateSettings({ notifyOnNewRequest: !notifyOnNewRequest })}
                  className="focus:outline-none"
                >
                  {notifyOnNewRequest ? (
                    <ToggleRight className="h-10 w-10 text-brand-blue" />
                  ) : (
                    <ToggleLeft className="h-10 w-10 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Maintenance parameters input */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Maintenance Alert Threshold (km)"
                  type="number"
                  value={maintenanceKm}
                  onChange={(e) => setMaintenanceKm(Number(e.target.value))}
                  placeholder="10000"
                />

                <Select
                  label="Billing Currency"
                  options={[
                    { value: 'INR', label: 'INR (₹) Indian Rupee' },
                    { value: 'USD', label: 'USD ($) United States Dollar' },
                    { value: 'EUR', label: 'EUR (€) Euro' }
                  ]}
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button onClick={handleSave} icon={Sparkles}>
                  Save parameters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database controls */}
          <Card>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Administrative Actions</h2>
              <p className="text-xs text-gray-500">Reset system registries</p>
            </CardHeader>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Reinitialize Database</h4>
                <p className="text-xs text-gray-500 mt-0.5">Wipe all active assignments and reload mock drivers, vehicles, and logs.</p>
              </div>
              <Button 
                variant="danger" 
                onClick={handleResetDatabase}
                isLoading={resetting}
                icon={RefreshCw}
              >
                Reset Database
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
