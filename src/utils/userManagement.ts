import { UserAccount, UserRole } from '../types';

const USERS_KEY = 'barangay_users';

// Initialize with default admin, staff, and resident accounts
const initializeDefaultUsers = (): void => {
  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    const defaultUsers: UserAccount[] = [
      {
        id: 'admin@gmail.com',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        name: 'Administrator',
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: 'staff@gmail.com',
        email: 'staff@gmail.com',
        password: 'staff123',
        role: 'staff',
        name: 'Staff Member',
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: 'resident@gmail.com',
        email: 'resident@gmail.com',
        password: 'resident123',
        role: 'resident',
        name: 'Resident',
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Initialize on first load
initializeDefaultUsers();

export const getAllUsers = (): UserAccount[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const getUserByEmail = (email: string): UserAccount | null => {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const getUserById = (id: string): UserAccount | null => {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
};

export const createUser = (user: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount => {
  const users = getAllUsers();
  
  // Check if email already exists
  const existing = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existing) {
    throw new Error('Email already exists');
  }

  const newUser: UserAccount = {
    ...user,
    id: user.email.toLowerCase(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const updateUser = (id: string, updates: Partial<UserAccount>): void => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index >= 0) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

export const deleteUser = (id: string): void => {
  const users = getAllUsers();
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
};

export const authenticateUser = (email: string, password: string): UserAccount | null => {
  const user = getUserByEmail(email);
  
  if (user && user.password === password && user.isActive) {
    return user;
  }
  
  return null;
};

export const getUsersByRole = (role: UserRole): UserAccount[] => {
  const users = getAllUsers();
  return users.filter(u => u.role === role && u.isActive);
};

