export type ValidationResult = {
  valid: boolean;
  message?: string;
};

// ========== LOGIN & BASIC AUTH ==========
export function validateAuth(emailOrUsername: string, password: string): ValidationResult {
  // ✅ Check if email or username is provided
  if (!emailOrUsername) {
    return { valid: false, message: 'Email or username is required.' };
  }

  // ✅ Check if password is provided
  if (!password) {
    return { valid: false, message: 'Password is required.' };
  }

  // ✅ Validate if it's either a valid email OR a valid username
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;  // Username: 3-20 chars, alphanumeric, underscore, hyphen

  const isValidEmail = emailRegex.test(emailOrUsername);
  const isValidUsername = usernameRegex.test(emailOrUsername);

  if (!isValidEmail && !isValidUsername) {
    return { 
      valid: false, 
      message: 'Please enter a valid email or username (3-20 characters, alphanumeric, underscore, or hyphen).' 
    };
  }

  return { valid: true };
}

// ========== USERNAME VALIDATION ==========
export function validateUsername(username: string): ValidationResult {
  if (!username) return { valid: false, message: 'Username is required.' };
  return { valid: true };
}

// ========== OTP VALIDATION ==========
export function validateOtp(otp: number): ValidationResult {
  if (!otp) return { valid: false, message: 'OTP is required.' };
  return { valid: true };
}

// ========== FORGOT PASSWORD ==========
export function validateForgotPass(email: string): ValidationResult {
  if (!email) return { valid: false, message: 'Email is required.' };
  return { valid: true };
}

// ========== EMAIL VALIDATION ==========
export function validateEmail(email: string): ValidationResult {
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email) return { valid: false, message: 'Email is required.' };
  if (!re.test(email)) return { valid: false, message: 'Invalid email format.' };
  return { valid: true };
}

// ========== PASSWORD VALIDATION ==========
export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, message: 'Password is required.' };

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }

  if (password.length > 50) {
    return { valid: false, message: 'Password must not exceed 50 characters.' };
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

// ========== CONFIRM PASSWORD VALIDATION ==========
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { valid: false, message: 'Please confirm your password.' };
  }

  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match.' };
  }

  return { valid: true };
}

// ========== TERMS VALIDATION ==========
export function validateTermsAccepted(hasAcceptedTerms: boolean): ValidationResult {
  if (!hasAcceptedTerms) {
    return { valid: false, message: 'You must accept terms and conditions.' };
  }

  return { valid: true };
}

// ========== COMBINED REGISTRATION VALIDATION ==========
export function validateRegisterInputs(
  email: string,
  password: string,
  username: string,
  confirmPassword: string,
  hasAcceptedTerms: boolean
): ValidationResult {
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) return emailValidation;

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) return usernameValidation;

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) return passwordValidation;

  // Validate confirm password
  const confirmValidation = validateConfirmPassword(password, confirmPassword);
  if (!confirmValidation.valid) return confirmValidation;

  // Validate terms
  const termsValidation = validateTermsAccepted(hasAcceptedTerms);
  if (!termsValidation.valid) return termsValidation;

  return { valid: true };
}