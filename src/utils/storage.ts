import { Resident, DocumentRequest } from '../types';

const RESIDENTS_KEY = 'barangay_residents';
const REQUESTS_KEY = 'barangay_requests';

// Generate hash code for requests
export const generateHashCode = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `BRG-${timestamp}-${random}`.toUpperCase();
};

// Residents Storage
export const getResidents = (): Resident[] => {
  const stored = localStorage.getItem(RESIDENTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const saveResident = (resident: Resident): void => {
  const residents = getResidents();
  const existingIndex = residents.findIndex(r => r.id === resident.id);
  
  if (existingIndex >= 0) {
    residents[existingIndex] = resident;
  } else {
    residents.push(resident);
  }
  
  localStorage.setItem(RESIDENTS_KEY, JSON.stringify(residents));
};

export const getResidentById = (id: string): Resident | null => {
  const residents = getResidents();
  return residents.find(r => r.id === id) || null;
};

export const deleteResident = (id: string): void => {
  const residents = getResidents();
  const filtered = residents.filter(r => r.id !== id);
  localStorage.setItem(RESIDENTS_KEY, JSON.stringify(filtered));
};

// Document Requests Storage
export const getRequests = (): DocumentRequest[] => {
  const stored = localStorage.getItem(REQUESTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const saveRequest = (request: DocumentRequest): void => {
  const requests = getRequests();
  const existingIndex = requests.findIndex(r => r.id === request.id);
  
  if (existingIndex >= 0) {
    requests[existingIndex] = request;
  } else {
    requests.push(request);
  }
  
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
};

export const getRequestById = (id: string): DocumentRequest | null => {
  const requests = getRequests();
  return requests.find(r => r.id === id) || null;
};

export const getRequestsByResidentId = (residentId: string): DocumentRequest[] => {
  const requests = getRequests();
  return requests.filter(r => r.residentId === residentId);
};

export const getRequestsByHashCode = (hashCode: string): DocumentRequest | null => {
  const requests = getRequests();
  return requests.find(r => r.hashCode === hashCode) || null;
};

export const deleteRequest = (id: string): void => {
  const requests = getRequests();
  const filtered = requests.filter(r => r.id !== id);
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(filtered));
};

