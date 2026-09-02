export const validateName = (val) => {
  if (!val || val.trim().length < 20) return 'Name must be at least 20 characters';
  if (val.trim().length > 60) return 'Name must be at most 60 characters';
  return '';
};

export const validateEmail = (val) => {
  if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Enter a valid email address';
  return '';
};

export const validatePassword = (val) => {
  if (!val) return 'Password is required';
  if (val.length < 8 || val.length > 16) return 'Password must be 8–16 characters';
  if (!/[A-Z]/.test(val)) return 'Password must contain at least one uppercase letter';
  if (!/[^a-zA-Z0-9]/.test(val)) return 'Password must contain at least one special character';
  return '';
};

export const validateAddress = (val) => {
  if (!val || !val.trim()) return 'Address is required';
  if (val.trim().length > 400) return 'Address must be at most 400 characters';
  return '';
};

export const validateRating = (val) => {
  const n = Number(val);
  if (!n || n < 1 || n > 5) return 'Rating must be between 1 and 5';
  return '';
};
