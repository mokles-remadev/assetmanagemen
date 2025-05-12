import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");


export const getrequest = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/purchase-sheets?token=${token}`, );
        return response.data;
    } catch (error) {
        console.error('Error fetching expense data:', error);
        throw error;
    }
}
export const getPurchaseId = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/purchase-sheets/${id}?token=${token}`, );
        return response.data;
    } catch (error) {
        console.error('Error fetching expense data:', error);
        throw error;
    }
}
export const createValidatedItems = async (validatedItems) => {
    try {
      const response = await axios.post('/api/validated-items/batch', validatedItems);
      return response.data;
    } catch (error) {
      console.error('Error creating validated items:', error);
      throw error;
    }
  };

export const createVehicleassets = async (asset) => {

    try {

        const response = await axios.post(`${BASE_URL}/assets/vehicles`, asset);
        return response.data;
    } catch (error) {
        console.error('Error creating vehicule asset:', error);
        throw error;
    }
};
export const createITassets = async (asset) => {
    try {
        const response = await axios.post(`${BASE_URL}/assets/it-materials`, asset);
        return response.data;
    } catch (error) {
        console.error('Error creating IT asset:', error);
        throw error;
    }
};
export const createFurnitureassets = async (asset) => {
    try {
        const response = await axios.post(`${BASE_URL}/assets/furniture`, asset);
        return response.data;
    } catch (error) {
        console.error('Error creating furniture asset:', error);
        throw error;
    }
};
export const createRealEstateassets = async (asset) => {
    try {
        const response = await axios.post(`${BASE_URL}/assets/real-estate`, asset);
        return response.data;
    } catch (error) {
        console.error('Error creating real estate asset:', error);
        throw error;
    }
};
export const createToolassets = async (asset) => {
    try {
        const response = await axios.post(`${BASE_URL}/assets/tools`, asset);
        return response.data;
    } catch (error) {
        console.error('Error creating tools asset:', error);
        throw error;
    }
};

// GET APIs for assets
export const getVehicleassets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/assets/vehicles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicle assets:', error);
        throw error;
    }
};
export const getITassets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/assets/it-materials`);
        return response.data;
    } catch (error) {
        console.error('Error fetching IT assets:', error);
        throw error;
    }
};
export const getFurnitureassets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/assets/furniture`);
        return response.data;
    } catch (error) {
        console.error('Error fetching furniture assets:', error);
        throw error;
    }
};
export const getRealEstateassets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/assets/real-estate`);
        return response.data;
    } catch (error) {
        console.error('Error fetching real estate assets:', error);
        throw error;
    }
};
export const getToolassets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/assets/tools`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tools assets:', error);
        throw error;
    }
};

// update APIs for assets
export const updateVehicleassets = async (id, asset) => {
    try {
        const response = await axios.put(`${BASE_URL}/assets/vehicles/${id}`, asset);
        return response.data;
    } catch (error) {
        console.error('Error updating vehicle asset:', error);
        throw error;
    }
};
export const updateITassets = async (id, asset) => {
    try {
        const response = await axios.put(`${BASE_URL}/assets/it-materials/${id}`, asset);
        return response.data;
    } catch (error) {
        console.error('Error updating IT asset:', error);
        throw error;
    }
};
export const updateFurnitureassets = async (id, asset) => {
    try {
        const response = await axios.put(`${BASE_URL}/assets/furniture/${id}`, asset);
        return response.data;
    } catch (error) {
        console.error('Error updating furniture asset:', error);
        throw error;
    }
};
export const updateRealEstateassets = async (id, asset) => {
    try {
        const response = await axios.put(`${BASE_URL}/assets/real-estate/${id}`, asset);
        return response.data;
    } catch (error) {
        console.error('Error updating real estate asset:', error);
        throw error;
    }
};
export const updateToolassets = async (id, asset) => {
    try {
        const response = await axios.put(`${BASE_URL}/assets/tools/${id}`, asset);
        return response.data;
    } catch (error) {
        console.error('Error updating tools asset:', error);
        throw error;
    }
};

export const getalias = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/code-aliases`, );
        return response.data;
    } catch (error) {
        console.error('Error fetching expense data:', error);
        throw error;
    }
};
export const getcategory = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/asset-codes/list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching expense data:', error);
        throw error;
    }
};
export const addrequest = async (request) => {
    try {
        const response = await axios.post(`${BASE_URL}/purchase-sheets?token=${token}`, request);
        return response.data;
    } catch (error) {
        console.error('Error adding request:', error);
        throw error;
    }
};
export const updateRequest = async (id, updatedRequest) => {
    try {
        const response = await axios.put(`${BASE_URL}/purchase-sheets/${id}?token=${token}`, updatedRequest);
        return response.data;
    } catch (error) {
        console.error('Error updating request:', error);
        throw error;
    }
};
export const deleteRequest = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/purchase-sheets/${id}?token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting request:', error);
        throw error;
    }
};
export const deleteRequestitem = async (id,item) => {
    try {
        const response = await axios.delete(`${BASE_URL}/purchase-sheets/deleteByItem?${id}&${item}&token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting request:', error);
        throw error;
    }
};
export const getSavedRequest = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/purchase-requests/${id}?token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching request by ID:', error);
        throw error;
    }
};


export const getcostcenter = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/generalCos/list`);
        const currentYear = new Date().getFullYear();
        return response.data.filter(costCenter => costCenter.year === currentYear);
    } catch (error) {
        console.error('Error fetching cost center:', error);
        throw error;
    }
};
export const getcostcenterProject = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/cosProject/list`);
        return response.data
    } catch (error) {
        console.error('Error fetching cost center:', error);
        throw error;
    }
};
export const getcompanyname = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/company/list`);
        return response.data.map(company => company.companyName);
    }
    catch (error) {
        console.error('Error fetching company name:', error);
        throw error;
    }
};


export const getsassets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/asset-codes/list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching assets:', error);
        throw error;
    }
}
export const getservice = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/service-codes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching assets:', error);
        throw error;
    }
}
export const getpaymentrequest = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/purchase-requests?token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment request:', error);
        throw error;
    }
}
export const addpaymentrequest = async (request) => {
    try {
        const response = await axios.post(`${BASE_URL}/purchase-requests?token=${token}`, request);
        return response.data;
    } catch (error) {
        console.error('Error adding payment request:', error);
        throw error;
    }
}
export const updatepaymentrequest = async (id, updatedRequest) => {
    try {
        const response = await axios.put(`${BASE_URL}/purchase-requests/${id}?token=${token}`, updatedRequest);
        return response.data;
    } catch (error) {
        console.error('Error updating payment request:', error);
        throw error;
    }
};
export const deletepaymentrequest = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/purchase-requests/${id}?token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting payment request:', error);
        throw error;
    }
};
export const getSavedpaymentrequest = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/purchase-requests/${id}?token=${token}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment request by ID:', error);
        throw error;
    }
};
export const getPaymentRequestsByPurchaseRef = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/purchase-requests?token=${token}`);
        const filteredData = response.data.filter(request => request.requisitionRef=== id);
        return filteredData;
    } catch (error) {
        console.error('Error fetching payment request by purchase request ID:', error);
        throw error;
    }
};

export const getsupplier = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/general/supplier`);
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier:', error);
        throw error;
    }
};
export const getbankbycompany = async (company) => {
    try {
        const response = await axios.get(`${BASE_URL}/general/bankName`);
        const filteredData = response.data.filter(bank => bank.companyname === company);
        return filteredData;
    } catch (error) {
        console.error('Error fetching bank by company:', error);
        throw error;
    }
};


  export const fetchAllListBankName = async () => {
    try {
      const response = await fetch(`${BASE_URL}/general/bankName`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bank data');
      }

      const data = await response.json();
      console.log("Bank data:", data);
      return data;

    } catch (error) {
      console.error('Error fetching bank data:', error);
      throw error;
    }
  };
  export const getAllVirement = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/VirementOrdre/list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier:', error);
        throw error;
    }
};