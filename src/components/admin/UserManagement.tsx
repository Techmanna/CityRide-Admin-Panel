import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Edit, Trash2, Plus, Search, X, CheckCircle, XCircle, 
  MoreVertical, Shield, Phone, Calendar, Upload, Mail,
  ChevronLeft, ChevronRight, Eye, FileText, Download,
  Clock, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserData {
  id: string;
  full_name: string;
  phone: string;
  is_driver: boolean;
  is_verified: boolean;
  photo_url: string;
  created_at: string;
  email: string;
  drivers?: {
    id: string;
    is_verified: boolean;
    is_available: boolean;
    rating: number;
    plate_number: string;
    model: string;
  };
}

interface DriverDocument {
  id: string;
  user_id: string;
  label: string;
  file_name: string;
  file_path: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDriverDetailsModalOpen, setIsDriverDetailsModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newUser, setNewUser] = useState<Partial<UserData>>({
    full_name: '',
    email: '',
    phone: '',
    is_driver: false,
    is_verified: false,
    photo_url: ''
  });
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['user_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          drivers (
            id,
            is_verified,
            is_available,
            rating,
            plate_number,
            model
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserData[];
    },
  });

  // Fetch driver documents for selected driver
  const { data: driverDocuments, isLoading: documentsLoading } = useQuery({
    queryKey: ['driver_documents', selectedDriverId],
    queryFn: async () => {
      if (!selectedDriverId) return [];
      
      const { data, error } = await supabase
        .from('driver_documents')
        .select('*')
        .eq('user_id', selectedDriverId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DriverDocument[];
    },
    enabled: !!selectedDriverId,
  });

  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profiles'] });
    },
  });

  const verifyDocument = useMutation({
    mutationFn: async ({ documentId, isVerified }: { documentId: string; isVerified: boolean }) => {
      const { error } = await supabase
        .from('driver_documents')
        .update({ 
          is_verified: isVerified,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver_documents', selectedDriverId] });
    },
  });

  // Fixed driver verification mutation
  const toggleDriverVerification = useMutation({
    mutationFn: async ({ driverId, isVerified }: { driverId: string; isVerified: boolean }) => {
      const { error } = await supabase
        .from('drivers')
        .update({ is_verified: isVerified })
        .eq('id', driverId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profiles'] });
      // queryClient.refetchQueries({ queryKey: ['user_profiles'], exact: false });
  // alert(`Driver ${newStatus ? 'verified' : 'unverified'} successfully`);
    },
  });

  const addUser = useMutation({
    mutationFn: async (userData: Partial<UserData>) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email!,
        password: 'TemporaryPassword123!',
      });
  
      if (authError) throw authError;
  
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user?.id,
          full_name: userData.full_name,
          phone: userData.phone,
          is_driver: userData.is_driver,
          photo_url: userData.photo_url,
        }]);
  
      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profiles'] });
      setIsAddUserModalOpen(false);
      setNewUser({
        full_name: '',
        email: '',
        phone: '',
        is_driver: false,
        photo_url: ''
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profiles'] });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setNewUser(prev => ({ ...prev, [name]: checked }));
    } else {
      setNewUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleViewDriverDetails = (driverId: string) => {
    setSelectedDriverId(driverId);
    setIsDriverDetailsModalOpen(true);
  };

  const handleCloseDriverDetails = () => {
    setIsDriverDetailsModalOpen(false);
    setSelectedDriverId(null);
  };

  const handleDownloadDocument = async (filePath: string, fileName: string) => {
    try {
      console.log('Attempting to download file from path:', filePath);

      const path = filePath.replace(/^driver-documents\//, '');

      const { data, error } = await supabase.storage
        .from('driver-documents')
        .download(path);

      if (error) {
        console.error('Supabase download error:', error.message || error);
        throw error;
      }

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading file:', error.message || error);
      alert(`Error downloading file: ${error.message || error}`);
    }
  };

  // Enhanced filtering with role filter functionality
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || 
        (selectedRole === 'isDriverTrue' && user.is_driver) ||
        (selectedRole === 'isDriverFalse' && !user.is_driver);
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'isDriverTrue':
        return 'bg-purple-100 text-purple-800';
      case 'isDriverFalse':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDriverBadge = (isDriver: boolean) => {
    return isDriver ? (
      <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
        Driver
      </span>
    ) : (
      <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-medium">
        Customer
      </span>
    );
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle size={12} className="mr-1" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock size={12} className="mr-1" />
        Pending
      </span>
    );
  };

  
  // Add this state to track individual loading states
const [loadingDrivers, setLoadingDrivers] = useState<Set<string>>(new Set());

// Updated handleToggleVerification function with optimistic updates
const handleToggleVerification = async (user: UserData) => {
  if (!user.is_driver) {
    alert('This user is not a driver');
    return;
  }

  setLoadingDrivers(prev => new Set(prev).add(user.id));

  try {
    // First, check if we have admin/service role access
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Current session:', sessionData?.session?.user?.role);

    // Fetch current driver data with explicit error handling
    const { data: driverData, error: fetchError } = await supabase
      .from('drivers')
      .select('id, is_verified, user_id')
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Fetch error details:', {
        message: fetchError.message,
        details: fetchError.details,
        hint: fetchError.hint,
        code: fetchError.code
      });
      alert(`Error fetching driver data: ${fetchError.message}`);
      return;
    }

    if (!driverData) {
      alert('Driver record not found');
      return;
    }

    const currentStatus = driverData.is_verified;
    const newStatus = !currentStatus;

    if (window.confirm(`Are you sure you want to ${newStatus ? 'verify' : 'unverify'} this driver?`)) {
      
      // Try the update with detailed error logging
      const { data: updateData, error: updateError } = await supabase
        .from('drivers')
        .update({ 
          is_verified: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', driverData.id)
        .select('id, is_verified, user_id');

      if (updateError) {
        console.error('Update error details:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        });
        
        // Check if it's an RLS issue
        if (updateError.code === '42501' || updateError.message.includes('permission')) {
          alert('Permission denied: You may not have sufficient privileges to update driver verification status.');
        } else {
          alert(`Error updating driver verification: ${updateError.message}`);
        }
        return;
      }

      console.log('Update successful:', updateData);

      // Check if any rows were actually updated
      if (!updateData || updateData.length === 0) {
        alert('No rows were updated. This might be due to Row Level Security policies.');
        return;
      }

      // Double-check the update
      const updatedRecord = updateData[0];
      if (updatedRecord.is_verified !== newStatus) {
        alert('Update failed: The verification status did not change as expected.');
        return;
      }

      // Refresh the UI data
      await queryClient.invalidateQueries({ 
        queryKey: ['user_profiles'],
        exact: true 
      });

      // Small delay to ensure the invalidation processes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await queryClient.refetchQueries({ 
        queryKey: ['user_profiles'],
        exact: true 
      });

      alert(`Driver ${newStatus ? 'verified' : 'unverified'} successfully`);
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    alert(`An unexpected error occurred: ${error.message || error}`);
  } finally {
    setLoadingDrivers(prev => {
      const newSet = new Set(prev);
      newSet.delete(user.id);
      return newSet;
    });
  }
};


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const selectedDriver = users?.find(user => user.id === selectedDriverId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition shadow-sm"
        >
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="isDriverFalse">Customers</option>
                <option value="isDriverTrue">Drivers</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers?.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {user.photo_url ? (
                          <img src={user.photo_url} alt={user.full_name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{user.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getDriverBadge(user.is_driver)}
                  </td>
                 <td className="px-6 py-4">
  <div className="flex items-center space-x-2">
    {user.is_driver && user.drivers ? (
  <>
    <motion.span
      key={`${user.id}-${user.drivers.is_verified}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        user.drivers.is_verified 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      {user.drivers.is_verified ? (
        <>
          <CheckCircle size={12} className="mr-1" />
          Verified
        </>
      ) : (
        <>
          <XCircle size={12} className="mr-1" />
          Not Verified
        </>
      )}
    </motion.span>

    <button
      onClick={() => handleToggleVerification(user)}
      disabled={loadingDrivers.has(user.id)}
      className={`text-xs px-3 py-1 border rounded-md font-medium transition-all duration-200 ${
        loadingDrivers.has(user.id)
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm active:bg-gray-100'
      }`}
    >
      {loadingDrivers.has(user.id) ? (
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        user.drivers.is_verified ? 'Unverify' : 'Verify'
      )}
    </button>
  </>
) : user.is_driver ? (
  <div className="flex items-center space-x-2">
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
      <AlertCircle size={12} className="mr-1" />
      Driver (No Record)
    </span>
    <span className="text-xs text-gray-500">
      Missing driver profile
    </span>
  </div>
) : (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
    <User size={12} className="mr-1" />
    Customer
  </span>
)}

  </div>
</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      {user.is_driver && (
                        <button 
                          onClick={() => handleViewDriverDetails(user.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Driver Documents"
                        >
                          <Eye size={20} />
                        </button>
                      )}
                      <button 
                        className="text-gray-400 hover:text-orange-600 transition-colors"
                        title="Edit User"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
                            deleteUser.mutate(user.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {paginatedUsers?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <User size={40} className="text-gray-300 mb-2" />
                      <p>No users found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {generatePageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Driver Details Modal */}
      <AnimatePresence>
        {isDriverDetailsModalOpen && selectedDriver && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDriverDetails}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Driver Details</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedDriver.full_name}</p>
                  </div>
                  <button
                    onClick={handleCloseDriverDetails}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Driver Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {selectedDriver.photo_url ? (
                          <img src={selectedDriver.photo_url} alt={selectedDriver.full_name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{selectedDriver.full_name}</h4>
                        <p className="text-sm text-gray-500">{selectedDriver.email}</p>
                        <p className="text-sm text-gray-500">{selectedDriver.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FileText className="mr-2" size={20} />
                      Driver Documents
                    </h4>
                    
                    {documentsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                    ) : driverDocuments && driverDocuments.length > 0 ? (
                      <div className="space-y-4">
                        {driverDocuments.map((document) => (
                          <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <FileText size={20} className="text-gray-400" />
                                  <div>
                                    <h5 className="font-medium text-gray-900">{document.label}</h5>
                                    <p className="text-sm text-gray-500">{document.file_name}</p>
                                    <p className="text-xs text-gray-400">
                                      Uploaded: {new Date(document.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                {getVerificationBadge(document.is_verified)}
                                
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleDownloadDocument(document.file_path, document.file_name)}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Download Document"
                                  >
                                    <Download size={16} />
                                  </button>
                                  
                                  {!document.is_verified ? (
                                    <button
                                      onClick={() => verifyDocument.mutate({ documentId: document.id, isVerified: true })}
                                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                      title="Verify Document"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => verifyDocument.mutate({ documentId: document.id, isVerified: false })}
                                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                      title="Unverify Document"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText size={40} className="mx-auto text-gray-300 mb-2" />
                        <p>No documents uploaded yet</p>
                        <p className="text-sm">Driver hasn't submitted any documents for verification</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddUserModalOpen(false)}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
                  <button
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={newUser.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={newUser.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_driver"
                      name="is_driver"
                      checked={newUser.is_driver}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_driver" className="ml-2 block text-sm text-gray-700">
                      Is Driver
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700 mb-1">
                      Photo URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="photo_url"
                        name="photo_url"
                        value={newUser.photo_url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter photo URL"
                      />
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 rounded-r-lg border border-l-0 border-gray-200">
                        <Upload size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
                  <button
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => addUser.mutate(newUser)}
                    disabled={!newUser.full_name || !newUser.phone || !newUser.email}
                    className={`px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 ${
                      (!newUser.full_name || !newUser.phone || !newUser.email) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Plus size={18} />
                    <span>Add User</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserManagement;
// ring-orange-500 focus:border-transparent"
//                       placeholder="Enter full name"
//                     />
//                   </div>
                  
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={newUser.email}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus: