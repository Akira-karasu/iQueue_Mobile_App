import api from '../api/api-connection';

export function authService() {
  const register = async (email: string, password: string, username: string, termsAccepted: boolean) => {
    try {
      const response = await api.post('/mobile-users/sign-up', { email, password, username, termsAccepted });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const register_send_otp = async (email: string) => {
    try {
      const response = await api.patch('/mobile-auth/send-otp', { email, otp_purpose: 'new_user_verification'});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

    const forgot_send_otp = async (email: string) => {
    try {
      const response = await api.patch('/mobile-auth/send-otp', { email, otp_purpose: 'password_reset'});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  };
  
  // const reset_email_otp = async (email: string) => {
  //   try {
  //     const response = await api.patch('/mobile-auth/send-otp', { email, otp_purpose: 'email_reset'});
  //     return response.data;
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || 'Failed to send OTP');
  //   }
  // };

  const otp_verify = async (email: string, otp_code: string) => {
    try {
      const response = await api.patch('/mobile-auth/verify-otp', { email, otp_code });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/mobile-auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  const changePass = async (email: string, password: string, confirmPassword: string) => {
    try {
      const response = await api.patch('/mobile-auth/change-password', { email, password, confirmPassword });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }


  const getUserInfo = async (id: number) => {
    try {
      const response = await api.get(`/mobile-users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  };

  const pushToken = async (token: string) => {
    try {
      const response = await api.post('/notification/PushNotif_test', { token });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Push token registration failed');
    }
  }

const storePushToken = async (id: number, token: string) => {
  try {
    // ✅ Validation
    if (!id || !token) {
      throw new Error('User ID and token are required');
    }

    console.log('📤 Sending push token:', { id, token });

    const response = await api.patch(`/mobile-users/${id}/push-token`, { 
      app_pushToken: token
    });
    
    console.log('✅ Push token stored successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Storing push token failed:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      fullError: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || 
      'Failed to store push token'
    );
  }
};

const changeEmail = async (id: number, newEmail: string) => {
  console.log("🔄 changeEmail called with:", { id, newEmail });
  try {
    // ✅ Validate
    if (!newEmail || newEmail.trim() === '') {
      throw new Error('Please enter a new email address');
    }

    if (!newEmail.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    // ✅ Send newEmail, not email
    const response = await api.patch(`/mobile-users/${id}/change-email`, { 
      newEmail: newEmail.toLowerCase().trim() // ✅ MUST be newEmail
    });
    
    console.log('✅ Email changed successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Email change failed');
  }
};

const changeUsername = async (id: number, newUsername: string) => {
  console.log("🔄 changeUsername called with:", { id, newUsername });
  try {
    // ✅ Validate
    if (!newUsername || newUsername.trim() === '') {
      throw new Error('Please enter a new username');
    }
    // ✅ Send newUsername, not username
    const response = await api.patch(`/mobile-users/${id}/change-username`, { 
      newUsername: newUsername.trim() // ✅ MUST be newUsername
    });
    console.log('✅ Username changed successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Username change failed');
  }
};

const changePasswordId = async (id: number, currentPassword: string, newPassword: string, confirmPassword: string) => {
  console.log("🔄 changePasswordId called with:", { id });
  try {
    // ✅ Validate
    if (!newPassword || newPassword.trim() === '') {
      throw new Error('Please enter a new password');
    }
    // ✅ Send id, not email
    const response = await api.patch(`/mobile-users/${id}/change-password`, { 
      currentPassword,
      newPassword,
      confirmPassword
    });
    
    console.log('✅ Password changed successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Password change failed');
  }
};

  return {
    register,
    register_send_otp,
    forgot_send_otp,
    otp_verify,
    getUserInfo,
    changeUsername,
    changePasswordId,
    changePass,
    pushToken,
    storePushToken,
    login,
    changeEmail
  };
}


