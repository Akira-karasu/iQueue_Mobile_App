
export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function validateAuth(email: string, password: string): ValidationResult {
  if (!email) return { valid: false, message: 'Email is required.' };
  if (!password) return { valid: false, message: 'Password is required.' };
  if (email !== "akira11@gmail.com" || password !== "password123") return { valid: false, message: 'Invalid email or password.' };
  return { valid: true };
}

export function validateOtp(otp: number): ValidationResult {
  if (!otp) return { valid: false, message: 'OTP is required.'};
  return { valid: true };
}

export function validateForgotPass(email: string): ValidationResult {
  if (!email) return { valid: false, message: 'Email is required.' };
  if (email !== "akira11@gmail.com") return { valid: false, message: 'email not exist' };
  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email) return { valid: false, message: 'Email is required.' };
  if (!re.test(email)) return { valid: false, message: 'Invalid email format.' };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, message: 'Password is required.' };
  if (password.length < 8 || password.length > 12) {
    return { valid: false, message: 'Password must be 8-12 characters.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one digit.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>\[\]\/\\_+=;'`~-]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character.' };
  }
  return { valid: true };
}

export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) return { valid: false, message: 'Please confirm your password.' };
  if (password !== confirmPassword) return { valid: false, message: 'Passwords do not match.' };
  return { valid: true };
}




