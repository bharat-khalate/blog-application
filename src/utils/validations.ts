/**
 * Utility validation functions
 */

export const validations = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^[+]?[0-9]{10,14}$/;
    return phoneRegex.test(phone.replaceAll(/\s/g, ''));
  },

  isValidMongoId: (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  isValidURL: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  sanitizeString: (str: string): string => {
    return str.trim().replaceAll(/[<>]/g, '');
  },

  validatePagination: (page?: string | number, limit?: string | number) => {
    let p = Number.parseInt(String(page), 10) || 1;
    let l = Number.parseInt(String(limit), 10) || 10;

    if (p < 1) p = 1;
    if (l < 1 || l > 100) l = 10;

    return { page: p, limit: l };
  },
};
