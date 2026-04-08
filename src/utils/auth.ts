import { User } from '../types';
import { authenticateUser } from './userManagement';

export const authenticate = (email: string, password: string): User | null => {
  const userAccount = authenticateUser(email, password);
  
  if (userAccount) {
    return {
      id: userAccount.id,
      email: userAccount.email,
      role: userAccount.role,
      name: userAccount.name
    };
  }
  
  return null;
};

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const storeUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem('user');
};

