// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    return 'Email is required'
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number'
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  return null
}

export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return `${fieldName} is required`
  }
  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters long`
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
  }
  return null
}

export const validateRole = (role) => {
  if (!role) {
    return 'Please select a role'
  }
  return null
}

export const validateTerms = (accepted) => {
  if (!accepted) {
    return 'You must accept the Terms & Conditions'
  }
  return null
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  // Remove any HTML tags
  return input.replace(/<[^>]*>/g, '')
    .trim()
}

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'None', color: 'text-text-muted' }
  
  let strength = 0
  
  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // Character variety
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  
  if (strength <= 2) {
    return { strength, label: 'Weak', color: 'text-red-500' }
  } else if (strength <= 4) {
    return { strength, label: 'Medium', color: 'text-yellow-500' }
  } else {
    return { strength, label: 'Strong', color: 'text-green-500' }
  }
}
