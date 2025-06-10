import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Car, CreditCard, HandCoins, Settings, LogOut, Menu, X, ChevronDown, Edit3, Plus, Trash2, Save, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import RideManagement from '../components/admin/RideManagement';
import TransactionManagement from '../components/admin/TransactionManagement';
import SettingsPanel from '../components/admin/SettingsPanel';
import PayoutManagement from '../components/admin/PayoutManagement';

// Ride Types Management Component
const RideTypesManagement = () => {
  const [rideTypes, setRideTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newRideType, setNewRideType] = useState({ name: '', fare: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', fare: '' });
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  // Fetch ride types from database
  const fetchRideTypes = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('ride_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRideTypes(data || []);
    } catch (err) {
      setError('Failed to fetch ride types: ' + err.message);
      console.error('Error fetching ride types:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRideTypes();
  }, []);

  // Create new ride type
  const handleCreate = async () => {
    if (!newRideType.name.trim() || !newRideType.fare) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('ride_types')
        .insert([
          {
            name: newRideType.name.trim(),
            fare: parseFloat(newRideType.fare)
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('A ride type with this name already exists');
        }
        throw error;
      }

      setRideTypes([data[0], ...rideTypes]);
      setNewRideType({ name: '', fare: '' });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to create ride type: ' + err.message);
      console.error('Error creating ride type:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update existing ride type
  const handleUpdate = async (id) => {
    if (!editForm.name.trim() || !editForm.fare) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('ride_types')
        .update({
          name: editForm.name.trim(),
          fare: parseFloat(editForm.fare)
        })
        .eq('id', id)
        .select();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('A ride type with this name already exists');
        }
        throw error;
      }

      setRideTypes(rideTypes.map(type => 
        type.id === id ? data[0] : type
      ));
      setEditingId(null);
      setEditForm({ name: '', fare: '' });
    } catch (err) {
      setError('Failed to update ride type: ' + err.message);
      console.error('Error updating ride type:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete ride type
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ride type? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('ride_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRideTypes(rideTypes.filter(type => type.id !== id));
    } catch (err) {
      setError('Failed to delete ride type: ' + err.message);
      console.error('Error deleting ride type:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (rideType) => {
    setEditingId(rideType.id);
    setEditForm({ name: rideType.name, fare: rideType.fare.toString() });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', fare: '' });
    setError(null);
  };

  const refreshData = () => {
    setInitialLoading(true);
    fetchRideTypes();
  };

  if (initialLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading ride types...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ride Types Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage ride types and their base fares</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              <RefreshCw size={20} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={loading}
            >
              <Plus size={20} />
              Add New Ride Type
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
          >
            <AlertCircle size={20} className="text-red-500" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Add New Ride Type Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border"
            >
              <h3 className="text-lg font-semibold mb-4">Add New Ride Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ride Type Name *
                  </label>
                  <input
                    type="text"
                    value={newRideType.name}
                    onChange={(e) => setNewRideType({ ...newRideType, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Tricycle, Motorcycle, Bus"
                    disabled={loading}
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Fare ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newRideType.fare}
                    onChange={(e) => setNewRideType({ ...newRideType, fare: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCreate}
                  disabled={loading || !newRideType.name.trim() || !newRideType.fare}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={16} />
                  {loading ? 'Creating...' : 'Create Ride Type'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewRideType({ name: '', fare: '' });
                    setError(null);
                  }}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ride Types Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ride Type Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Fare
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rideTypes.map((rideType) => (
                <motion.tr
                  key={rideType.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === rideType.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={loading}
                        maxLength={100}
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{rideType.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === rideType.id ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm.fare}
                        onChange={(e) => setEditForm({ ...editForm, fare: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={loading}
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        ₦{parseFloat(rideType.fare || 0).toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rideType.created_at ? new Date(rideType.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === rideType.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(rideType.id)}
                          disabled={loading || !editForm.name.trim() || !editForm.fare}
                          className="text-orange-600 hover:text-orange-900 disabled:opacity-50 transition-colors"
                          title="Save changes"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={loading}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Cancel editing"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(rideType)}
                          disabled={loading}
                          className="text-orange-600 hover:text-orange-900 disabled:opacity-50 transition-colors"
                          title="Edit ride type"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(rideType.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
                          title="Delete ride type"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {rideTypes.length === 0 && !initialLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <Car size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ride types found</h3>
            <p className="text-sm text-gray-500 mb-4">Get started by creating your first ride type!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus size={20} />
              Add First Ride Type
            </button>
          </motion.div>
        )}

        {/* Statistics */}
        {rideTypes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-100 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800">Total Ride Types</h4>
                <p className="text-2xl font-bold text-blue-900">{rideTypes.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800">Lowest Fare</h4>
                <p className="text-2xl font-bold text-green-900">
                  ₦{Math.min(...rideTypes.map(rt => parseFloat(rt.fare || 0))).toFixed(2)}
                </p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800">Highest Fare</h4>
                <p className="text-2xl font-bold text-purple-900">
                  ₦{Math.max(...rideTypes.map(rt => parseFloat(rt.fare || 0))).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span>Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRidesDropdownOpen, setIsRidesDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('/admin/users');
  const { logout } = useAuth();

  const navItems = [
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { 
      path: '/admin/rides', 
      icon: <Car size={20} />, 
      label: 'Rides',
      hasDropdown: true,
      dropdownItems: [
        { path: '/admin/rides', label: 'All Rides' },
        { path: '/admin/rides/types', label: 'Edit Ride Types' }
      ]
    },
    { path: '/admin/transactions', icon: <CreditCard size={20} />, label: 'Transactions' },
    { path: '/admin/payouts', icon: <HandCoins size={20} />, label: 'Payouts' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleNavClick = (path, hasDropdown = false) => {
    if (hasDropdown) {
      setIsRidesDropdownOpen(!isRidesDropdownOpen);
    } else {
      setCurrentPage(path);
      setIsRidesDropdownOpen(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case '/admin/users':
        return <UserManagement />;
      case '/admin/rides':
        return <RideManagement />;
      case '/admin/rides/types':
        return <RideTypesManagement />;
      case '/admin/transactions':
        return <TransactionManagement />;
      case '/admin/payouts':
        return <PayoutManagement />;
      case '/admin/settings':
        return <SettingsPanel />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold">HI, ADMIN 👋</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => (
            <div key={item.path}>
              <button
                onClick={() => handleNavClick(item.path, item.hasDropdown)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:rounded-full text-left transition-colors ${
                  currentPage === item.path || (item.hasDropdown && currentPage.startsWith('/admin/rides'))
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </div>
                {item.hasDropdown && isSidebarOpen && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isRidesDropdownOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </button>
              
              {/* Dropdown Menu */}
              {item.hasDropdown && isRidesDropdownOpen && isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-4 mt-1 space-y-1"
                >
                  {item.dropdownItems.map((dropdownItem) => (
                    <button
                      key={dropdownItem.path}
                      onClick={() => setCurrentPage(dropdownItem.path)}
                      className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === dropdownItem.path
                          ? 'bg-orange-100 text-orange-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {dropdownItem.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
          <button
            onClick={logout}
            className="flex items-center px-4 py-3 mt-32 text-red-600 hover:bg-gray-100 w-full hover:rounded-full transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;