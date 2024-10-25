import z from "zod";

export const checkValidEmail = (email: string): boolean => {
  if (!z.string().email().safeParse(email).success) {
    throw new Error("Invalid email format");
  }
  return true;
};

export const checkValidUrl = (url: string): boolean => {
  const urlPattern = /^(http:\/\/|https:\/\/)/i;
  if (!urlPattern.test(url)) {
    throw new Error("Invalid URL format. URL must start with http:// or https:// and contain a valid domain");
  }
  return true;
};

export const checkValidLength = (value: string, min: number, max: number) => {
  if (min < 0 || max < min) {
    throw new Error("Invalid min/max length parameters");
  }
  if (!z.string().min(min).max(max).safeParse(value).success) {
    throw new Error(`Length must be between ${min} and ${max} characters`);
  }
  return true;
};

// export const checkValidPhoneNumber = (phoneNumber: string): string => {
//   const phonePattern = /^\+?[\d\s-]{10,15}$/;
//   if (!phonePattern.test(phoneNumber)) {
//     throw new Error(
//       "Invalid phone number format. Must contain 10-15 digits and may include spaces, hyphens, and country code",
//     );
//   }
//   return phoneNumber; // Return the phone number instead of a boolean
// };

export const checkValidNumeric = (value: string, allowDecimals = false): boolean => {
  const numericPattern = allowDecimals ? /^\d*\.?\d+$/ : /^\d+$/;
  if (!numericPattern.test(value)) {
    throw new Error(allowDecimals ? "Value must be a valid number (decimals allowed)" : "Value must be a valid integer");
  }
  return true;
};

export const checkValidPassword = (password: string): boolean => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(password)) {
    throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
  }
  return true;
};
