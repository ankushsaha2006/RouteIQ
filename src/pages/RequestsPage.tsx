import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useFleetStore } from '../store/fleetStore';
import { useToastStore } from '../components/ui/Toast';
import { Request, Vehicle, Driver, Assignment } from '../types';
import { 
  Plus, Search, Navigation, User as UserIcon, Truck, 
  MapPin, Calendar, Clock, Sparkles, Check, CheckCircle2 
} from 'lucide-react';

export const RequestsPage = () => {
  const { 
    requests, vehicles, drivers, assignments,
    fetchRequests, fetchVehicles, fetchDrivers, fetchAssignments,
    updateVehicleStatus, updateDriverStatus 
  } = useFleetStore();

  const { showToast } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Request['status']>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // Selected request to dispatch
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);

  // New Request Form State
  const [newRequest, setNewRequest] = useState({
    passengerName: '',
    pickupAddress: '',
    dropoffAddress: '',
    passengers: 1
  });

  // Assign Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchRequests(),
      fetchVehicles(),
      fetchDrivers(),
      fetchAssignments()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddRequest = () => {
    if (!newRequest.passengerName || !newRequest.pickupAddress || !newRequest.dropoffAddress) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    const requestItem: Request = {
      id: 'r' + Math.random().toString(36).substr(2, 9),
      passengerName: newRequest.passengerName,
      pickup: { address: newRequest.pickupAddress, lat: 28.6 + Math.random() * 0.1, lng: 77.2 + Math.random() * 0.1 },
      dropoff: { address: newRequest.dropoffAddress, lat: 28.6 + Math.random() * 0.1, lng: 77.2 + Math.random() * 0.1 },
      status: 'new',
      passengers: newRequest.passengers,
      requestedAt: new Date().toISOString()
    };

    // Add item to local store array
    useFleetStore.setState((state) => ({ requests: [requestItem, ...state.requests] }));
    
    setIsAddModalOpen(false);
    setNewRequest({ passengerName: '', pickupAddress: '', dropoffAddress: '', passengers: 1 });
    showToast('Transit load request added successfully', 'success');
  };

  const openDispatch = (request: Request) => {
    setActiveRequest(request);
    setSelectedVehicleId('');
    setSelectedDriverId('');
    setIsAssignModalOpen(true);
  };

  const handleDispatch = () => {
    if (!activeRequest || !selectedVehicleId || !selectedDriverId) {
      showToast('Please select both a vehicle and driver', 'warning');
      return;
    }

    const selectVehicle = vehicles.find(v => v.id === selectedVehicleId);
    const selectDriver = drivers.find(d => d.id === selectedDriverId);

    if (!selectVehicle || !selectDriver) {
      showToast('System validation error', 'error');
      return;
    }

    // Update request state
    useFleetStore.setState((state) => ({
      requests: state.requests.map((r) =>
        r.id === activeRequest.id
          ? { 
              ...r, 
              status: 'assigned', 
              assignedAt: new Date().toISOString(), 
              vehicleId: selectedVehicleId 
            }
          : r
      )
    }));

    // Update vehicle & driver status
    updateVehicleStatus(selectedVehicleId, 'active');
    updateDriverStatus(selectedDriverId, 'busy');

    // Create a new Assignment in fleetStore
    const newRun: Assignment = {
      id: 'a' + Math.random().toString(36).substr(2, 9),
      title: `Transit Load: ${activeRequest.passengerName}`,
      status: 'active',
      vehicleId: selectedVehicleId,
      driverId: selectedDriverId,
      startTime: new Date().toISOString(),
      stops: [
        { address: activeRequest.pickup.address, lat: activeRequest.pickup.lat, lng: activeRequest.pickup.lng },
        { address: activeRequest.dropoff.address, lat: activeRequest.dropoff.lat, lng: activeRequest.dropoff.lng }
      ],
      revenue: Math.floor(2500 + Math.random() * 5000)
    };

    useFleetStore.setState((state) => ({
      assignments: [newRun, ...state.assignments]
    }));

    setIsAssignModalOpen(false);
    showToast(`Dispatched ${selectVehicle.number} successfully`, 'success');
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch = r.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pickup.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.dropoff.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Fetch only idle vehicles & online drivers
  const idleVehicles = vehicles.filter(v => v.status === 'idle');
  const onlineDrivers = drivers.filter(d => d.status === 'online');

  const getStatusBadge = (status: Request['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="warning">Unassigned</Badge>;
      case 'assigned':
        return <Badge variant="info">Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="success">In Transit</Badge>;
      case 'completed':
        return <Badge variant="secondary">Delivered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">Transit Dispatch Queue</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Book, map, and dispatch cargo and passenger transit requests</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>
          Add Request Load
        </Button>
      </div>

      {/* Stats Mini Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/5 to-amber-500/10 border-amber-200/50 dark:border-amber-900/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Unassigned Loads</p>
              <h3 className="text-2xl font-extrabold text-amber-950 dark:text-amber-200 mt-1">
                {requests.filter(r => r.status === 'new').length}
              </h3>
            </div>
            <Navigation className="h-8 w-8 text-amber-500/60" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/10 border-blue-200/50 dark:border-blue-900/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Idle Vehicles</p>
              <h3 className="text-2xl font-extrabold text-blue-950 dark:text-blue-200 mt-1">
                {idleVehicles.length}
              </h3>
            </div>
            <Truck className="h-8 w-8 text-blue-500/60" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/10 border-green-200/50 dark:border-green-900/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">Standby Drivers</p>
              <h3 className="text-2xl font-extrabold text-green-950 dark:text-green-200 mt-1">
                {onlineDrivers.length}
              </h3>
            </div>
            <UserIcon className="h-8 w-8 text-green-500/60" />
          </CardContent>
        </Card>
      </div>

      {/* Filters Area */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by dispatcher client name, source, or target destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <Select
              label="Routing Status"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'new', label: 'Unassigned' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'in_progress', label: 'In Transit' },
                { value: 'completed', label: 'Delivered' }
              ]}
              value={statusFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | Request['status'])}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.map((request) => (
              <Card 
                key={request.id} 
                className={`transition-all ${
                  request.status === 'new' 
                    ? 'border-l-4 border-l-amber-500 hover:shadow-md' 
                    : 'hover:bg-slate-50/20'
                }`}
              >
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column: Client & Load Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-bold text-primary dark:text-primary-dark">
                        {request.passengerName}
                      </h3>
                      {getStatusBadge(request.status)}
                      <span className="text-xs text-gray-400 font-mono">ID: {request.id}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">Pickup</p>
                          <p className="mt-0.5 truncate max-w-[240px]">{request.pickup.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[10px] text-gray-400 uppercase tracking-wider">Dropoff</p>
                          <p className="mt-0.5 truncate max-w-[240px]">{request.dropoff.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Metadata */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center text-xs text-gray-500 gap-2 px-0 md:px-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{new Date(request.requestedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{new Date(request.requestedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {request.passengers} Payload Units
                    </div>
                  </div>

                  {/* Right Column: Dispatch Action */}
                  <div className="flex items-center justify-end flex-shrink-0">
                    {request.status === 'new' ? (
                      <Button onClick={() => openDispatch(request)} icon={Sparkles}>
                        Match & Dispatch
                      </Button>
                    ) : (
                      <div className="flex items-center text-xs font-bold text-green-500 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-xl border border-green-200 dark:border-green-900/50">
                        <CheckCircle2 className="h-4.5 w-4.5 mr-1.5" /> Dispatched
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No transit requests found"
            description="Adjust your search criteria or register a new cargo load request."
            icon={Navigation}
          />
        )}
      </div>

      {/* Add Request Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Transit Cargo Request"
      >
        <div className="space-y-4">
          <Input
            label="Client/Sender Name"
            placeholder="John Doe Logistics Ltd."
            value={newRequest.passengerName}
            onChange={(e) => setNewRequest({...newRequest, passengerName: e.target.value})}
            required
          />

          <Input
            label="Pickup Site Address"
            placeholder="Delhi Airport Terminal 3 Depot"
            value={newRequest.pickupAddress}
            onChange={(e) => setNewRequest({...newRequest, pickupAddress: e.target.value})}
            required
          />

          <Input
            label="Target Target Address"
            placeholder="Retail Warehouse Sector 62, Noida"
            value={newRequest.dropoffAddress}
            onChange={(e) => setNewRequest({...newRequest, dropoffAddress: e.target.value})}
            required
          />

          <Input
            label="Payload Load Units (Tons/Containers/Seats)"
            type="number"
            value={newRequest.passengers}
            onChange={(e) => setNewRequest({...newRequest, passengers: Number(e.target.value)})}
            required
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRequest}>
              Add Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign/Dispatch Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Optimize Match & Dispatch"
      >
        <div className="space-y-4">
          {activeRequest && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dispatch Load</p>
              <h4 className="text-sm font-extrabold text-primary dark:text-primary-dark">{activeRequest.passengerName}</h4>
              <p className="text-xs text-gray-500">{activeRequest.pickup.address} → {activeRequest.dropoff.address}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Assign Fleet Vehicle</label>
            {idleVehicles.length > 0 ? (
              <Select
                options={[
                  { value: '', label: 'Select idle vehicle...' },
                  ...idleVehicles.map(v => ({ value: v.id, label: `${v.number} — ${v.type} (Cap: ${v.capacity}kg)` }))
                ]}
                value={selectedVehicleId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedVehicleId(e.target.value)}
              />
            ) : (
              <p className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-200/30">
                ⚠️ All vehicles are currently active or undergoing maintenance.
              </p>
            )}

            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mt-4">Assign Standby Driver</label>
            {onlineDrivers.length > 0 ? (
              <Select
                options={[
                  { value: '', label: 'Select standby driver...' },
                  ...onlineDrivers.map(d => ({ value: d.id, label: `${d.name} — Rating: ${d.rating}★` }))
                ]}
                value={selectedDriverId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDriverId(e.target.value)}
              />
            ) : (
              <p className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-200/30">
                ⚠️ All drivers are offline or busy.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDispatch}
              disabled={!selectedVehicleId || !selectedDriverId}
              icon={Check}
            >
              Confirm Dispatch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestsPage;
