/**
 * useUsers Hook
 * Manages users data fetching and state
 */
import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, UserData, updateUserStatus, deleteUser } from '../data/api/userApi';

export interface UseUsersOptions {
  autoFetch?: boolean;
}

export interface UseUsersReturn {
  users: UserData[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  fetchUsers: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  updateUser: (userId: number, status: string) => Promise<void>;
  removeUser: (userId: number) => Promise<void>;
  clearError: () => void;
  statistics: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
    premium: number;
  };
}

export const useUsers = (options: UseUsersOptions = {}): UseUsersReturn => {
  const { autoFetch = true } = options;
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useUsers: Fetching users...');
      const usersData = await getAllUsers();
      console.log('useUsers: Fetched users:', usersData);
      
      setUsers(usersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      console.error('useUsers: Error fetching users:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      console.log('useUsers: Refreshing users...');
      const usersData = await getAllUsers();
      console.log('useUsers: Refreshed users:', usersData);
      
      setUsers(usersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh users';
      console.error('useUsers: Error refreshing users:', errorMessage);
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: number, status: string) => {
    try {
      console.log(`useUsers: Updating user ${userId} status to ${status}...`);
      
      await updateUserStatus(userId, status);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status, updatedAt: new Date().toISOString() }
            : user
        )
      );
      
      console.log('useUsers: User status updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user status';
      console.error('useUsers: Error updating user status:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const removeUser = useCallback(async (userId: number) => {
    try {
      console.log(`useUsers: Removing user ${userId}...`);
      
      await deleteUser(userId);
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      console.log('useUsers: User removed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      console.error('useUsers: Error removing user:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Calculate statistics
  const statistics = {
    total: users.length,
    active: users.filter(user => user.kycStatus === 'approved' || user.kycStatus === 'active').length,
    pending: users.filter(user => user.kycStatus === 'pending').length,
    inactive: users.filter(user => user.kycStatus === 'rejected' || user.kycStatus === 'inactive').length,
    premium: users.filter(user => user.role === 'premium').length,
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return {
    users,
    loading,
    error,
    refreshing,
    fetchUsers,
    refreshUsers,
    updateUser,
    removeUser,
    clearError,
    statistics,
  };
};
