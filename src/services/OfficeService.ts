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

export async function submitRequestTransaction(
  requestPersonalInfo: Record<string, any>,
  requestTransaction: Record<string, any>
) {
  try {
    const formData = new FormData();

    // ✅ Append all non-file fields
    Object.entries(requestPersonalInfo).forEach(([key, value]) => {
      if (key !== 'pictureID' && value !== undefined) {
        // ✅ Handle boolean specially - send as '1' or '0'
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else if (value !== null) {
          // ✅ Only append non-null values for non-boolean fields
          formData.append(key, String(value));
        }
      }
    });

    // ✅ Append picture file if present
    if (requestPersonalInfo.pictureID) {
      let uri = requestPersonalInfo.pictureID;

      if (uri.startsWith('file://')) {
        uri = uri;
      } else if (!uri.startsWith('content://')) {
        uri = `file://${uri}`;
      }

      const filename = uri.split('/').pop() ?? `upload_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('pictureID', {
        uri,
        name: filename,
        type,
      } as any);
    }

    // ✅ Append transaction data as JSON
    formData.append('RequestTransact', JSON.stringify(requestTransaction));

    const response = await api.post('office-service/CreateRequestInfo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 10000,
    });

    console.log('✅ Upload successful:', response.data);
    return response.data;

  } catch (error: any) {
    console.error('❌ Transaction submission failed:', error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 'Transaction submission failed'
    );
  }
}

export async function getCurrentRequestTransactions(email: string, bustCache?: boolean) {
    try {
        console.log('📡 Fetching transactions for:', email);
        
        const response = await api.get('office-service/FindAllUsersWithTransactions', {
            params: { 
                email,
                _t: Date.now() // ✅ Always bust cache
            }
        });
        
        console.log('📦 API Response received');
        
        return response.data;
        
    } catch (error: any) {
        console.error('❌ Transaction fetch error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
    }
}

// ✅ Cancel all transactions for a personal info
export async function cancelTransactionRequest(personalInfoId: number) {
    try {
        console.log('🚫 Cancelling all transactions for personal info ID:', personalInfoId);
        
        const response = await api.patch('office-service/CancelledTransaction', {
            personalInfoId: personalInfoId
        });
        
        console.log('✅ All transactions cancelled successfully:', response.data);
        
        // ✅ Emit socket event for real-time update
        // const socket = getRequestTransactionProcessSocket();
        // socket.emit('transactionCancelled', {
        //     personalInfoId: personalInfoId,
        //     cancelledAt: new Date().toISOString()
        // });
        
        return response.data;
        
    } catch (error: any) {
        console.error('❌ Cancel transaction failed:', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Failed to cancel transactions');
    }
}