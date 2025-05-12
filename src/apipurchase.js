import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

// Enhanced Asset Management API endpoints
export const getAssetsByType = async (type, filters = {}) => {
  try {
    const params = new URLSearchParams({
      type,
      ...filters,
      token
    });
    const response = await axios.get(`${BASE_URL}/assets/${type.toLowerCase()}?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const updateAsset = async (id, assetData) => {
  const { type, ...data } = assetData;
  try {
    const response = await axios.put(`${BASE_URL}/assets/${type.toLowerCase()}/${id}?token=${token}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

export const getAssetMetrics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/assets/metrics?token=${token}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching asset metrics:', error);
    throw error;
  }
};

export const getDepartmentDistribution = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/assets/department-distribution?token=${token}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    throw error;
  }
};

export const getRecentUpdates = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/assets/recent-updates?token=${token}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent updates:', error);
    throw error;
  }
};

export const getAssetHistory = async (id, type) => {
  try {
    const response = await axios.get(`${BASE_URL}/assets/${type.toLowerCase()}/${id}/history?token=${token}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching asset history:', error);
    throw error;
  }
};

export const transferAsset = async (id, type, transferData) => {
  try {
    const response = await axios.post(`${BASE_URL}/assets/${type.toLowerCase()}/${id}/transfer?token=${token}`, transferData);
    return response.data;
  } catch (error) {
    console.error('Error transferring asset:', error);
    throw error;
  }
};

export const scheduleAssetMaintenance = async (id, type, maintenanceData) => {
  try {
    const response = await axios.post(`${BASE_URL}/assets/${type.toLowerCase()}/${id}/maintenance?token=${token}`, maintenanceData);
    return response.data;
  } catch (error) {
    console.error('Error scheduling maintenance:', error);
    throw error;
  }
};

// Keep all existing API functions
export const getrequest = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/purchase-sheets?token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching expense data:', error);
        throw error;
    }
}

// ... (rest of the existing API functions remain unchanged)