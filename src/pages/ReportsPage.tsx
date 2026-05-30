import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useFleetStore } from '../store/fleetStore';
import { useToastStore } from '../components/ui/Toast';
import { DataTable } from '../components/ui/DataTable';
import { 
  BarChart, TrendingUp, DollarSign, Calendar, 
  Download, ArrowUpRight, ArrowDownRight, Award 
} from 'lucide-react';
import { Assignment } from '../types';

export const ReportsPage = () => {
  const { assignments, fetchAssignments } = useFleetStore();
  const { showToast } = useToastStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchAssignments();
      setLoading(false);
    };
    load();
  }, []);

  const handleDownload = () => {
    showToast('Report downloaded as PDF/CSV successfully', 'success');
  };

  // Metrics
  const totalRevenue = assignments.reduce((sum, a) => sum + a.revenue, 0);
  const averageTicket = assignments.length > 0 ? totalRevenue / assignments.length : 0;
  
  // Custom columns for Assignments report grid
  const columns = [
    {
      key: 'id' as keyof Assignment,
      title: 'Run ID',
      render: (val: string) => <span className="font-mono text-xs font-semibold">{val}</span>
    },
    {
      key: 'title' as keyof Assignment,
      title: 'Task Route',
      render: (val: string) => <span className="font-semibold text-primary dark:text-primary-dark">{val}</span>
    },
    {
      key: 'status' as keyof Assignment,
      title: 'Dispatch Status',
      render: (val: string) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
          val === 'completed' 
            ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400'
        }`}>
          {val}
        </span>
      )
    },
    {
      key: 'revenue' as keyof Assignment,
      title: 'Yield Value',
      render: (val: number) => <span className="font-mono font-semibold">₹{val.toLocaleString()}</span>
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">Network Intelligence</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Deep analysis of operational revenue, margins, and fleet performance</p>
        </div>
        <Button onClick={handleDownload} icon={Download}>
          Export PDF Summary
        </Button>
      </div>

      {/* Primary Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-tr from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/10">
          <CardContent className="p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
              <DollarSign className="h-24 w-24" />
            </div>
            <p className="text-[10px] uppercase font-bold text-blue-100 tracking-wider">Total Route Value</p>
            <h2 className="text-3xl font-extrabold mt-1">₹{totalRevenue.toLocaleString()}</h2>
            <div className="mt-4 flex items-center text-xs text-blue-100">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>+14.3% growth vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average dispatch yield</p>
              <h2 className="text-2xl font-extrabold text-primary dark:text-primary-dark mt-1">
                ₹{Math.floor(averageTicket).toLocaleString()}
              </h2>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-500 font-semibold">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>Yield efficiency optimal</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Fuel Efficiency</p>
              <h2 className="text-2xl font-extrabold text-primary dark:text-primary-dark mt-1">14.8 km/l</h2>
            </div>
            <div className="mt-4 flex items-center text-xs text-red-500 font-semibold">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              <span>-2.1% fuel drop (maintenance alert)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic SVG Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Monthly Revenue Trend</h2>
            <p className="text-xs text-gray-500">Gross route earnings curve (Current Year)</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full relative">
              {/* SVG Area Chart */}
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800/60" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800/60" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800/60" />
                
                {/* Area Fill */}
                <path d="M 0 200 L 0 170 Q 100 120 200 150 T 400 60 L 500 40 L 500 200 Z" fill="url(#chartGlow)" />
                
                {/* Line Path */}
                <path d="M 0 170 Q 100 120 200 150 T 400 60 L 500 40" fill="none" stroke="#2563eb" strokeWidth="3.5" />
                
                {/* Active Dots */}
                <circle cx="200" cy="150" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <circle cx="400" cy="60" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              </svg>
              
              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-wider">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fleet KPI Breakdown Card */}
        <Card className="flex flex-col">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Network Capacity index</h2>
            <p className="text-xs text-gray-500">Fleet capacity utilization values</p>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col justify-around space-y-4">
            {/* KPI Progress Bars */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-500">Route Efficiency Rate</span>
                <span className="font-bold text-primary dark:text-primary-dark">94.6%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full" style={{ width: '94.6%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-500">Cargo Volume Capacity</span>
                <span className="font-bold text-primary dark:text-primary-dark">78.2%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-purple rounded-full" style={{ width: '78.2%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-500">Driver Shift Compliance</span>
                <span className="font-bold text-primary dark:text-primary-dark">98.1%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '98.1%' }}></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center space-x-2 text-xs text-brand-purple bg-purple-500/5 dark:bg-purple-500/10 p-3 rounded-xl border border-purple-500/15">
              <Award className="h-5 w-5 text-brand-purple flex-shrink-0" />
              <span className="font-semibold">Network capacity utilization rates match tier-1 logistics compliance standards.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid List of all Completed Runs */}
      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-primary dark:text-primary-dark">Operational History Logs</h2>
          <p className="text-xs text-gray-500">Historical manifest entries</p>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            data={assignments}
            columns={columns}
            searchable={true}
            searchPlaceholder="Search log indices..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
