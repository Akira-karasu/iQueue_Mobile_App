import api from '../api/api-connection';
import * as FileSystem from 'expo-file-system/legacy';

// ✅ File size constants - Updated to 5MB
const FILE_SIZE_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
};

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
    console.log('📤 Starting submitRequestTransaction...');
    
    const formData = new FormData();

    // ✅ Step 1: Append all non-file fields FIRST
    console.log('📝 Step 1: Appending text fields...');
    Object.entries(requestPersonalInfo).forEach(([key, value]) => {
      // Skip picture field - will handle separately
      if (key === 'pictureID') {
        console.log(`  ⏭️  Skipping ${key} - will append as file`);
        return;
      }

      // Skip undefined/null
      if (value === undefined || value === null) {
        console.log(`  ⏭️  Skipping ${key} - null/undefined`);
        return;
      }

      try {
        // Handle boolean values
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
          console.log(`  ✓ ${key}: ${value ? '1' : '0'} (boolean)`);
        } else {
          // Convert all other values to string
          const stringValue = String(value);
          formData.append(key, stringValue);
          console.log(
            `  ✓ ${key}: ${stringValue.length > 50 ? stringValue.substring(0, 50) + '...' : stringValue}`
          );
        }
      } catch (appendError) {
        console.error(`  ❌ Error appending ${key}:`, appendError);
        throw appendError;
      }
    });

    // ✅ Step 2: Append picture file AFTER text fields
    if (requestPersonalInfo.pictureID) {
      console.log('📸 Step 2: Processing picture file...');
      
      let uri = requestPersonalInfo.pictureID;
      console.log(`  🔗 Original URI: ${uri}`);

      // ✅ Normalize URI - ensure it starts with file:// or content://
      if (!uri.startsWith('file://') && !uri.startsWith('content://')) {
        uri = `file://${uri}`;
      }
      console.log(`  🔗 Normalized URI: ${uri}`);

      // ✅ Verify file exists
      try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          throw new Error(`File not found at: ${uri}`);
        }
        const fileSizeMB = (fileInfo.size! / 1024 / 1024).toFixed(2);
        console.log(`  ✅ File exists - Size: ${fileSizeMB}MB`);

        // ✅ Check file size (5MB limit) - UPDATED
        if (fileInfo.size! > FILE_SIZE_LIMITS.MAX_SIZE_BYTES) {
          throw new Error(
            `File too large: ${fileSizeMB}MB (max ${FILE_SIZE_LIMITS.MAX_SIZE_MB}MB)`
          );
        }
      } catch (fileError: any) {
        console.error(`  ❌ File check failed:`, fileError.message);
        throw fileError;
      }

      // ✅ Extract filename and MIME type
      const filename = uri.split('/').pop() || `upload_${Date.now()}.jpg`;
      const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType =
        ext === 'jpg' || ext === 'jpeg'
          ? 'image/jpeg'
          : ext === 'png'
            ? 'image/png'
            : ext === 'gif'
              ? 'image/gif'
              : 'image/jpeg';

      console.log(`  📄 Filename: ${filename}`);
      console.log(`  🎨 MIME Type: ${mimeType}`);

      // ✅ Append file using React Native FormData format
      try {
        formData.append('pictureID', {
          uri: uri,
          type: mimeType,
          name: filename,
        } as any);
        console.log(`  ✓ Picture appended successfully`);
      } catch (fileAppendError) {
        console.error(`  ❌ Error appending picture:`, fileAppendError);
        throw fileAppendError;
      }
    } else {
      console.log('⚠️  Step 2: No picture ID provided (optional)');
    }

    // ✅ Step 3: Append transaction data as JSON LAST
    console.log('📋 Step 3: Appending transaction data...');
    try {
      const transactionJson = JSON.stringify(requestTransaction);
      formData.append('RequestTransact', transactionJson);
      console.log(`  ✓ Transaction JSON appended (${transactionJson.length} bytes)`);
      console.log(
        `  📊 Structure: Registrar=${requestTransaction.RegistrarOffice?.requestList?.length || 0}, Accounting=${requestTransaction.AccountingOffice?.requestList?.length || 0}`
      );
    } catch (txnError) {
      console.error(`  ❌ Error appending transaction:`, txnError);
      throw txnError;
    }

    // ✅ Step 4: Send request with proper configuration
    console.log('🚀 Step 4: Sending multipart request to API...');
    console.log(`  🌐 Endpoint: office-service/CreateRequestInfo`);
    console.log(`  ⏱️  Timeout: 60000ms`);

    const response = await api.post(
      'office-service/CreateRequestInfo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        timeout: 60000, // ✅ 60 second timeout
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    console.log('✅ Upload successful!');
    console.log('📦 Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Transaction submission failed');
    console.error('📋 Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code,
    });

    // ✅ Provide helpful error messages
    let errorMessage = 'Transaction submission failed';

    if (error.response?.status === 400) {
      errorMessage = `Bad Request: ${error.response?.data?.message || 'Invalid form data'}`;
    } else if (error.response?.status === 413) {
      errorMessage = `File too large - try using a smaller image (max ${FILE_SIZE_LIMITS.MAX_SIZE_MB}MB)`;
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error - please try again later';
    } else if (error.message.includes('Network')) {
      errorMessage = 'Network error - check your connection';
    } else if (error.message.includes('File not found')) {
      errorMessage = 'Image file not found. Please select a valid image.';
    } else if (error.message.includes('File too large')) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}

export async function getCurrentRequestTransactions(email: string, bustCache?: boolean) {
    try {
        console.log('📡 Fetching transactions for:', email);
        
        const response = await api.get('office-service/FindAllUsersWithTransactions', {
            params: { 
                email
            }
        });
        
        console.log('📦 API Response received');
        return response.data;
        
    } catch (error: any) {
        console.error('❌ Transaction fetch error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
    }
}

export async function cancelTransactionRequest(personalInfoId: number) {
    try {
        console.log('🚫 Cancelling all transactions for personal info ID:', personalInfoId);
        
        const response = await api.patch('office-service/CancelledTransaction', {
            personalInfoId: personalInfoId
        });
        
        console.log('✅ All transactions cancelled successfully:', response.data);
        return response.data;
        
    } catch (error: any) {
        console.error('❌ Cancel transaction failed:', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Failed to cancel transactions');
    }
}

export async function getRequestTransactionRequest(personalInfoId: number) {
    try {
        console.log('📡 Fetching request transaction for personalInfoId:', personalInfoId);
        
        const response = await api.get(`office-service/GetRequestTransaction/${personalInfoId}`);
        
        console.log('📦 Request transaction received:', response.data);
        return response.data;
        
    } catch (error: any) {
        console.error('❌ Request transaction fetch error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch request transaction');
    }
}

export async function getQueueStatusByPersonalId(personalId: number) {
    try {
        console.log('📡 Fetching queue status for personal ID:', personalId);
        
        const response = await api.get(`queue-number/status/${personalId}`);
        
        console.log('📦 Queue status received:', response.data);
        return response.data;
        
    } catch (error: any) {
        console.error('❌ Queue status fetch error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch queue status');
    }
}