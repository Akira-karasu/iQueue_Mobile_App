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
      if (key !== 'pictureID' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // ✅ Append picture file if present
    if (requestPersonalInfo.pictureID) {
      let uri = requestPersonalInfo.pictureID;

      // Ensure proper file URI format for Android/iOS
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

    // ✅ Send to NestJS endpoint
    const response = await api.post('office-service/CreateRequestInfo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 10000, // optional: helps prevent hanging uploads
    });

    console.log('✅ Upload successful:', response.data);
    return response.data;

  } catch (error: any) {
    console.error('❌ Transaction upload failed:', error);
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