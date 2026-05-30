import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useFleetStore } from '../store/fleetStore';
import { 
  Sparkles, Truck, Navigation, Users, BarChart, 
  MapPin, Clock, ArrowRight, Zap, RefreshCw
} from 'lucide-react';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { 
    vehicles, drivers, assignments, requests,
    fetchVehicles, fetchDrivers, fetchAssignments, fetchRequests 
  } = useFleetStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchVehicles(),
      fetchDrivers(),
      fetchAssignments(),
      fetchRequests()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchVehicles(),
      fetchDrivers(),
      fetchAssignments(),
      fetchRequests()
    ]);
    setRefreshing(false);
  };

  // Metrics calculators
  const stats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    onlineDrivers: drivers.filter(d => d.status === 'online').length,
    pendingRequests: requests.filter(r => r.status === 'new').length,
    totalRevenue: assignments.reduce((sum, a) => sum + a.revenue, 0),
    efficiency: 94.6 // Mock efficiency
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'completed':
        return <Badge variant="info">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue mb-4"></div>
        <p className="text-sm text-gray-500">Loading fleet intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">Operations Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time status of your logistics network</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            isLoading={refreshing}
            icon={RefreshCw}
          >
            Refresh
          </Button>
          <Button onClick={() => navigate('/requests')} icon={Zap}>
            Dispatch Queue
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Fleet */}
        <Card>
          <CardContent className="p-5 flex items-center">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
              <Truck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fleet Utilization</p>
              <h3 className="text-2xl font-extrabold text-primary dark:text-primary-dark mt-0.5">
                {stats.activeVehicles}/{stats.totalVehicles}
              </h3>
              <p className="text-[10px] text-green-500 font-semibold flex items-center mt-0.5">
                <span>Active vehicles currently</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Drivers */}
        <Card>
          <CardContent className="p-5 flex items-center">
            <div className="rounded-xl bg-green-500/10 p-3 text-green-600 dark:text-green-400">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Drivers</p>
              <h3 className="text-2xl font-extrabold text-primary dark:text-primary-dark mt-0.5">
                {stats.onlineDrivers}
              </h3>
              <p className="text-[10px] text-green-500 font-semibold flex items-center mt-0.5">
                <span>Online & standby</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Dispatch requests */}
        <Card>
          <CardContent className="p-5 flex items-center">
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
              <Navigation className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unassigned Loads</p>
              <h3 className="text-2xl font-extrabold text-primary dark:text-primary-dark mt-0.5">
                {stats.pendingRequests}
              </h3>
              <p className="text-[10px] text-purple-500 font-semibold flex items-center mt-0.5">
                <span>Awaiting dispatcher action</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Revenue */}
        <Card>
          <CardContent className="p-5 flex items-center">
            <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-600 dark:text-yellow-400">
              <BarChart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Network Earnings</p>
              <h3 className="text-2xl font-extrabold text-primary dark:text-primary-dark mt-0.5">
                ₹{stats.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-[10px] text-green-500 font-semibold flex items-center mt-0.5">
                <span>+{stats.efficiency}% efficiency rating</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Map Simulation & Active Runs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer */}
        <Card className="lg:col-span-2 relative overflow-hidden flex flex-col min-h-[350px]">
          <CardHeader className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Live Fleet Visualizer</h2>
              <p className="text-xs text-gray-500">Real-time simulation of metropolitan route assignments</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative bg-slate-900 overflow-hidden min-h-[250px]">
            {/* Mock Vector Map Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            
            {/* Glowing active paths */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              <path d="M 50 100 Q 200 40 400 120 T 600 200" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_10s_linear_infinite]" />
              <path d="M 150 250 Q 300 150 450 220" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_8s_linear_infinite]" />
            </svg>
            
            {/* Live markers */}
            <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-ping absolute"></div>
              <div className="h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white"></div>
              <span className="text-[9px] bg-slate-800/80 text-blue-200 px-1 rounded mt-1 border border-blue-500/30">Hub Alpha</span>
            </div>

            <div className="absolute top-1/2 left-3/4 flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-purple-500 animate-ping absolute"></div>
              <div className="h-3 w-3 rounded-full bg-purple-500 ring-2 ring-white"></div>
              <span className="text-[9px] bg-slate-800/80 text-purple-200 px-1 rounded mt-1 border border-purple-500/30">Truck-v1</span>
            </div>

            <div className="absolute bottom-1/4 left-1/2 flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-ping absolute"></div>
              <div className="h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>
              <span className="text-[9px] bg-slate-800/80 text-green-200 px-1 rounded mt-1 border border-green-500/30">Van-v4</span>
            </div>

            {/* Bottom Overlay Legend */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 border border-slate-800 backdrop-blur-md p-3 rounded-xl flex items-center justify-between">
              <div className="text-[10px] text-slate-300 space-y-1">
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-blue-500 mr-2" /> Central Warehouse Depot</span>
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-purple-500 mr-2" /> Active Heavy Transport (v1)</span>
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-green-500 mr-2" /> Active Express Courier (v4)</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Live System Sync</p>
                <p className="text-[9px] text-green-400 mt-0.5 font-mono">Status: Optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Route Runs Panel */}
        <Card className="flex flex-col">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Active Dispatches</h2>
            <p className="text-xs text-gray-500">Live fleet route assignments</p>
          </CardHeader>
          <CardContent className="p-3 flex-1 overflow-y-auto space-y-3">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-2.5 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-brand-blue tracking-wide truncate max-w-[120px]">
                      {assignment.title}
                    </span>
                    {getStatusBadge(assignment.status)}
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center text-[11px] text-gray-500">
                      <MapPin className="h-3.5 w-3.5 mr-1.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{assignment.stops[0]?.address}</span>
                    </div>
                    <div className="flex items-center text-[11px] text-gray-500">
                      <ArrowRight className="h-3 w-3 mr-1.5 ml-0.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{assignment.stops[assignment.stops.length - 1]?.address}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[10px] text-gray-400">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(assignment.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className="font-bold text-primary dark:text-primary-dark">
                      ₹{assignment.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                <Truck className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-semibold">No active dispatches</p>
                <p className="text-xs text-gray-400 mt-1">Assign runs in the dispatches panel</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Fleet Overview Table & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles summary list */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Fleet Vehicles</h2>
              <p className="text-xs text-gray-500">Operational status checklist</p>
            </div>
            <button 
              onClick={() => navigate('/vehicles')} 
              className="text-xs text-brand-blue hover:underline font-semibold"
            >
              View all
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-slate-100 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] text-gray-500 uppercase font-extrabold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Vehicle Number</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Capacity (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {vehicles.slice(0, 4).map((vehicle) => (
                    <tr 
                      key={vehicle.id} 
                      onClick={() => navigate('/vehicles')}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/20 cursor-pointer"
                    >
                      <td className="px-4 py-3.5 font-semibold text-primary dark:text-primary-dark">{vehicle.number}</td>
                      <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">{vehicle.type}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          vehicle.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400'
                            : vehicle.status === 'idle'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400'
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs font-semibold text-primary dark:text-primary-dark">
                        {vehicle.capacity.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Dispatch Action shortcuts */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Quick Dispatch</h2>
            <p className="text-xs text-gray-500">Fast action hotlinks</p>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50/50 dark:bg-blue-950/15 border border-blue-100/50 dark:border-blue-900/30 rounded-xl">
              <Zap className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">Instant Match Optimization</h4>
                <p className="text-[10px] text-blue-700/80 dark:text-blue-400/80 mt-0.5">Let RouteIQ AI assign your pending cargo loads to optimal vehicles automatically.</p>
                <button 
                  onClick={() => navigate('/requests')}
                  className="text-[10px] font-bold text-brand-blue dark:text-blue-400 hover:underline mt-2 flex items-center"
                >
                  Configure AI Match <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <button 
                onClick={() => navigate('/vehicles')}
                className="w-full flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-xl text-xs font-bold text-primary dark:text-primary-dark transition-all"
              >
                <span>Register a new Fleet Vehicle</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => navigate('/requests')}
                className="w-full flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-xl text-xs font-bold text-primary dark:text-primary-dark transition-all"
              >
                <span>Create new Cargo Transit Load</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Simulation Keyframes */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardOverview;
