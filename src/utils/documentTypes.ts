import { DocumentType } from '../types';

export const DOCUMENT_TYPES: { value: DocumentType; label: string; description: string }[] = [
  {
    value: 'indigency_clearance',
    label: 'Indigency Clearance',
    description: 'Certificate for indigent residents'
  },
  {
    value: 'barangay_clearance',
    label: 'Barangay Clearance',
    description: 'General barangay clearance certificate'
  },
  {
    value: 'certificate_of_residency',
    label: 'Certificate of Residency',
    description: 'Proof of residency in the barangay'
  },
  {
    value: 'business_permit',
    label: 'Business Permit',
    description: 'Permit to operate business in barangay'
  },
  {
    value: 'cedula',
    label: 'Cedula',
    description: 'Community tax certificate'
  }
];

export const getDocumentTypeLabel = (type: DocumentType): string => {
  const docType = DOCUMENT_TYPES.find(dt => dt.value === type);
  return docType?.label || type;
};

