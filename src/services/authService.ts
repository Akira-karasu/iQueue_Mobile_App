import api from '../api/api-connection';

export function authService() {
  const register = async (email: string, password: string, termsAccepted: boolean) => {
    try {
      const response = await api.post('/mobile-users/sign-up', { email, password, termsAccepted });
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

  const changePass = async (email: string, password: string) => {
    try {
      const response = await api.post('/mobile-auth/change-password', { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }

  const pushToken = async (token: string) => {
    try {
      const response = await api.post('/notification/PushNotif_test', { token });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Push token registration failed');
    }
  }

  const storePushToken = async (id: number,token: string) => {
    try {
      const response = await api.patch('/mobile-users/push-token', { id, token });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Storing push token failed');
    }
  }

  return {
    register,
    register_send_otp,
    forgot_send_otp,
    otp_verify,
    changePass,
    pushToken,
    login,
    storePushToken
  };
}


