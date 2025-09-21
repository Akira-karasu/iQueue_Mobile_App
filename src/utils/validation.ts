
export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function validateAuth(email: string, password: string): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;
  const passwordResult = validatePassword(password);
  if (!passwordResult.valid) return passwordResult;
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



// Example usage:
// const emailResult = validateEmail(email);
// if (!emailResult.valid) showMessage(emailResult.message);
