/**
 * Property API
 * Handles all API calls related to properties
 */

const API_BASE_URL = 'http://161.97.100.109:7001/api/Property';

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic API request handler
 */
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      `Network error: ${error instanceof Error ? error.message : String(error)}`,
      0,
      null
    );
  }
};

/**
 * Property API methods
 */
export const propertyApi = {
  /**
   * Get all properties
   */
  async getAllProperties() {
    try {
      const data = await apiRequest(`${API_BASE_URL}/getAllProperty`);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        return data;
      }
      
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      if (data.properties && Array.isArray(data.properties)) {
        return data.properties;
      }
      
      // If response is an object with property data
      if (data.id || data.title || data.name) {
        return [data];
      }
      
      // Fallback - return empty array if structure is unexpected
      console.warn('Unexpected API response structure:', data);
      return [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  /**
   * Get property by ID
   */
  async getPropertyById(id: string | number) {
    try {
      const data = await apiRequest(`${API_BASE_URL}/getPropertyById/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new property
   */
  async createProperty(propertyData: Record<string, unknown>) {
    try {
      // Server expects [FromForm] so always use FormData
      const formData = new FormData();
      
      console.log('createProperty - propertyData:', propertyData);
      console.log('Creating FormData for [FromForm] endpoint...');
      console.log('Property data keys:', Object.keys(propertyData));
      
      // Add all property data fields EXCEPT Files first
      Object.keys(propertyData).forEach(key => {
        if (key !== 'Files') {
          // Add other fields as strings
          console.log(`Adding field ${key}:`, propertyData[key]);
          formData.append(key, String(propertyData[key]));
        }
      });
      
      // Add Files separately - server expects "Files" (capitalized)
      if (propertyData.Files && Array.isArray(propertyData.Files)) {
        const files = propertyData.Files as File[];
        console.log('Adding Files to FormData:', files.length, 'files');
        console.log('Files array:', files);
        
        // Try different approaches to append files
        files.forEach((file, index) => {
          console.log(`Adding file ${index}:`, file.name, file.type, file.size);
          console.log('File object:', file);
          console.log('Is File instance?', file instanceof File);
          
          // Server expects "Files" (capitalized) to match C# PropertyDto.Files
          formData.append("Files", file, file.name);
        });
      } else {
        console.log('No Files found in propertyData or Files is not an array');
        console.log('propertyData.Files:', propertyData.Files);
      }
      
      // Debug: Log FormData contents
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      
      // Check if Files are actually in FormData
      const filesInFormData = [];
      for (const [key, value] of formData.entries()) {
        if (key === 'Files' && value instanceof File) {
          filesInFormData.push(value);
        }
      }
      console.log('Files found in FormData:', filesInFormData.length);
      console.log('Files in FormData details:', filesInFormData.map(f => ({ name: f.name, type: f.type, size: f.size })));
      
      console.log('Sending FormData to API...');
      console.log('API URL:', `${API_BASE_URL}/addNewProperty`);
      
      const response = await fetch(`${API_BASE_URL}/addNewProperty`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('API Response status:', response.status);
      console.log('API Response statusText:', response.statusText);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'Failed to parse error response' };
        }
        console.error('API Error Response:', errorData);
        console.error('API Error Status:', response.status);
        console.error('API Error StatusText:', response.statusText);
        throw new APIError(
          `API request failed: ${response.statusText}`,
          response.status,
          errorData
        );
      }
      
      const result = await response.json();
      console.log('API Success Response:', result);
      return result;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  /**
   * Update property
   */
  async updateProperty(id: string | number, propertyData: Record<string, unknown>) {
    try {
      const data = await apiRequest(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(propertyData),
      });
      return data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete property
   */
  async deleteProperty(id: string | number) {
    try {
      const data = await apiRequest(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      return data;
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search properties
   */
  async searchProperties(searchParams: Record<string, unknown>) {
    try {
      const queryString = new URLSearchParams(searchParams as Record<string, string>).toString();
      const data = await apiRequest(`${API_BASE_URL}/search?${queryString}`);
      
      if (Array.isArray(data)) {
        return data;
      }
      
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  },

  /**
   * Upload property images
   */
  async uploadPropertyImages(propertyId: string | number, files: File[]) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`images`, file);
      });

      const response = await fetch(`${API_BASE_URL}/uploadImages/${propertyId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new APIError(
          `Upload failed: ${response.statusText}`,
          response.status,
          null
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }
};

export { APIError };
