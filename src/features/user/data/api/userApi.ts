/**
 * User API Service
 * Handles all user-related API calls
 */

const API_BASE_URL = 'http://161.97.100.109:7001';

export interface UserData {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  name: string;
  kycStatus: string;
  createdAt: string;
  lastLoginAt: string;
  emailConfirmed: boolean;
  // Additional fields that might be present
  totalInvestments?: number;
  totalAmount?: number;
  role?: string;
}

export interface RegisterUserData {
  phoneNumber: string;
  password: string;
  email: string;
  name: string;
  userType: number;
}

export interface UsersResponse {
  success: boolean;
  data: UserData[];
  message?: string;
  totalCount?: number;
}

export interface UserApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Fetch all users from the system
 */
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    console.log('Fetching all users from API...');
    
    const response = await fetch(`${API_BASE_URL}/api/Account/GetAllUserSystem`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Users API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Users API error response:', errorText);
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Users API response data:', data);

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('Unexpected API response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<UserData> => {
  try {
    console.log(`Fetching user ${userId} from API...`);
    
    const response = await fetch(`${API_BASE_URL}/api/Account/GetUserById/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('User API response data:', data);

    // Handle different response formats
    if (data && data.id) {
      return data;
    } else if (data && data.data && data.data.id) {
      return data.data;
    } else {
      throw new Error('Invalid user data format');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update user status
 */
export const updateUserStatus = async (userId: number, status: string): Promise<UserData> => {
  try {
    console.log(`Updating user ${userId} status to ${status}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/Account/UpdateUserStatus/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Update user status response:', data);

    return data.data || data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    console.log(`Deleting user ${userId}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/Account/DeleteUser/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
    }

    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterUserData): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log('Registering new user...', userData);
    
    const response = await fetch(`${API_BASE_URL}/api/Account/RegisterNewUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    console.log('Register user response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `Failed to register user: ${response.statusText}`);
    }

    return {
      success: true,
      message: responseData.message || 'User registered successfully'
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
