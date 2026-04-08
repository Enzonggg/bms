export type UserRole = 'admin' | 'staff' | 'resident';

export type DocumentType = 'indigency_clearance' | 'barangay_clearance' | 'certificate_of_residency' | 'business_permit' | 'cedula';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  createdAt: string;
  createdBy?: string;
  isActive: boolean;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  address: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  civilStatus: 'single' | 'married' | 'widowed' | 'divorced' | 'separated';
  occupation?: string;
  registeredAt: string;
  registeredBy?: string;
}

export interface DocumentRequest {
  id: string;
  hashCode: string;
  residentId: string;
  residentName: string;
  documentType: DocumentType;
  purpose: string;
  status: RequestStatus;
  requestedAt: string;
  processedBy?: string;
  processedAt?: string;
  remarks?: string;
  rejectionReason?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

