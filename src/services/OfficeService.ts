import api from '../api/api-connection';

export async function getDocuments() {
    try {
        const response = await api.get('office-service/GetDocuments');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Documents unavailable');
  }
}

export async function getPayments() {
    try {
        const response = await api.get('office-service/GetFees');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Payments unavailable');
  }
}

export async function submitRequestTransaction(requestPersonalInfo: any, requestTransaction: any) {

    console.log('Submitting Transaction:', {...requestPersonalInfo, ...requestTransaction});
    try {
        const response = await api.post('office-service/CreateRequestInfo', {
            ...requestPersonalInfo,
            ...requestTransaction
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Transaction submission failed');
    }
}

// export async function getPersonalInfo(email: string) {
//   try {
//     const response = await api.get("office-service/GetOnePersonalInfo", { params: { email } });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Personal information unavailable');
//   }
// }

export async function getCurrentRequestTransactions(email: string) {
    try {
        const response = await api.get('office-service/FindAllUsersWithTransactions', {
            params: { email }
        });
        
        console.log('API Response:', response.data);
        return response.data;
        
    } catch (error: any) {
        console.error('Transaction fetch error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
    }
}

