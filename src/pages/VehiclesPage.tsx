// src/pages/VehiclesPage.tsx
import { useEffect, useState } from 'react';
import type { ChangeEvent, FC, ReactNode } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/input';
import { Search, Plus, Truck, Wrench } from 'lucide-react';
import { useFleetStore } from '../store/fleetStore';
import { Vehicle } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { useUIStore } from '../store/uiStore';

interface VehicleColumn {
  key: keyof Vehicle;
  title: string;
  render?: (value: any, row: Vehicle) => React.ReactNode;
}

export const VehiclesPage: FC = () => {
  const { vehicles, fetchVehicles, addVehicle } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Vehicle['status']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Vehicle['type']>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    number: '',
    type: 'Truck',
    capacity: 5000,
    status: 'idle',
    lastUpdate: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchVehicles();
      setIsLoading(false);
    };
    loadData();
  }, [fetchVehicles]);

  const filteredVehicles = vehicles.filter((vehicle: Vehicle) => {
    const matchesSearch = vehicle.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusCounts = {
    total: vehicles.length,
    active: vehicles.filter((v: Vehicle) => v.status === 'active').length,
    idle: vehicles.filter((v: Vehicle) => v.status === 'idle').length,
    maintenance: vehicles.filter((v: Vehicle) => v.status === 'maintenance').length
  };

  const vehicleTypes = Array.from(new Set(vehicles.map((v: Vehicle) => v.type))) as Vehicle['type'][];

  const handleAddVehicle = () => {
    addVehicle({
      ...newVehicle,
      status: 'idle',
      lastUpdate: new Date().toISOString()
    });
    setIsAddModalOpen(false);
    setNewVehicle({ number: '', type: 'Truck', capacity: 5000, status: 'idle', lastUpdate: new Date().toISOString() });
  };

  const getStatusBadge = (status: Vehicle['status'] | string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'idle':
        return <Badge variant="info">Idle</Badge>;
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns: VehicleColumn[] = [
    {
      key: 'number',
      title: 'Vehicle Number',
      render: (value: string, row: Vehicle) => (
        <div className="font-medium text-primary">{value}</div>
      )
    },
    {
      key: 'type',
      title: 'Type'
    },
    {
      key: 'capacity',
      title: 'Capacity (kg)',
      render: (value: number) => (
        <div>{value.toLocaleString()}</div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: any, row: Vehicle) => getStatusBadge(row.status)
    },
    {
      key: 'driverId',
      title: 'Driver',
      render: (driverId: string) => (
        <div className="text-gray-500">
          {driverId ? 'Assigned' : 'Unassigned'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Vehicles</h1>
          <p className="text-gray-600 mt-1">Manage your fleet vehicles</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>
          Add Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-primary">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-primary">{statusCounts.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Idle</p>
                <p className="text-2xl font-bold text-primary">{statusCounts.idle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-primary">{statusCounts.maintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <Select
              label="Status"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'idle', label: 'Idle' },
                { value: 'maintenance', label: 'Maintenance' }
              ]}
              value={statusFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | Vehicle['status'])}
            />
            <Select
              label="Type"
              options={[
                { value: 'all', label: 'All Types' },
                ...vehicleTypes.map(type => ({ value: type, label: type }))
              ]}
              value={typeFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-primary">Vehicle Registry</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <DataTable
              data={filteredVehicles}
              columns={columns}
              onRowClick={(vehicle) => console.log('View vehicle details:', vehicle)}
            />
          ) : (
            <EmptyState
              title="No vehicles found"
              description="Try adjusting your search or filter criteria"
              icon={Truck}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Vehicle"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Vehicle Number"
            placeholder="DL-01-H-1234"
            value={newVehicle.number}
            onChange={(e) => setNewVehicle({...newVehicle, number: e.target.value})}
            required
          />
          
          <Select
            label="Vehicle Type"
            options={[
              { value: 'Truck', label: 'Truck' },
              { value: 'Van', label: 'Van' },
              { value: 'Bike', label: 'Bike' }
            ]}
            value={newVehicle.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewVehicle({...newVehicle, type: e.target.value})}
          />
          
          <Input
            label="Capacity (kg)"
            type="number"
            placeholder="5000"
            value={newVehicle.capacity}
            onChange={(e) => setNewVehicle({...newVehicle, capacity: Number(e.target.value)})}
            required
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVehicle}>
              Add Vehicle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
