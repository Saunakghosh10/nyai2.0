import { DocumentTemplate } from '@/types/draft';

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'rental-agreement',
    name: 'Rental Agreement',
    category: 'real-estate',
    description: 'Create a legally binding rental/lease agreement',
    fields: [
      {
        id: 'landlordName',
        label: 'Landlord Name',
        type: 'text',
        required: true,
        placeholder: 'Full name of the property owner',
      },
      {
        id: 'tenantName',
        label: 'Tenant Name',
        type: 'text',
        required: true,
        placeholder: 'Full name of the tenant',
      },
      {
        id: 'propertyAddress',
        label: 'Property Address',
        type: 'textarea',
        required: true,
        placeholder: 'Complete address of the rental property',
      },
      {
        id: 'rentAmount',
        label: 'Monthly Rent',
        type: 'number',
        required: true,
        placeholder: 'Monthly rent amount in INR',
      },
      {
        id: 'startDate',
        label: 'Lease Start Date',
        type: 'date',
        required: true,
      },
      {
        id: 'duration',
        label: 'Lease Duration',
        type: 'select',
        required: true,
        options: ['11 months', '1 year', '2 years', '3 years'],
      },
    ],
  },
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    category: 'business',
    description: 'Generate an employment agreement with standard terms',
    fields: [
      {
        id: 'employerName',
        label: 'Employer Name',
        type: 'text',
        required: true,
        placeholder: 'Company/Organization name',
      },
      {
        id: 'employeeName',
        label: 'Employee Name',
        type: 'text',
        required: true,
        placeholder: 'Full name of the employee',
      },
      {
        id: 'position',
        label: 'Job Position',
        type: 'text',
        required: true,
        placeholder: 'Job title/position',
      },
      {
        id: 'salary',
        label: 'Annual Salary',
        type: 'number',
        required: true,
        placeholder: 'Annual salary in INR',
      },
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'date',
        required: true,
      },
      {
        id: 'employmentType',
        label: 'Employment Type',
        type: 'select',
        required: true,
        options: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      },
    ],
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    category: 'business',
    description: 'Create a confidentiality agreement to protect sensitive information',
    fields: [
      {
        id: 'disclosingParty',
        label: 'Disclosing Party',
        type: 'text',
        required: true,
        placeholder: 'Name of the party sharing confidential information',
      },
      {
        id: 'receivingParty',
        label: 'Receiving Party',
        type: 'text',
        required: true,
        placeholder: 'Name of the party receiving confidential information',
      },
      {
        id: 'purpose',
        label: 'Purpose of Disclosure',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the business purpose for sharing confidential information',
      },
      {
        id: 'duration',
        label: 'Duration of Confidentiality',
        type: 'select',
        required: true,
        options: ['1 year', '2 years', '3 years', '5 years', 'Perpetual'],
      },
      {
        id: 'jurisdiction',
        label: 'Governing Law',
        type: 'text',
        required: true,
        placeholder: 'State/jurisdiction governing this agreement',
      },
    ],
  },
  {
    id: 'affidavit',
    name: 'General Affidavit',
    category: 'legal',
    description: 'Generate a sworn statement for legal purposes',
    fields: [
      {
        id: 'deponentName',
        label: 'Deponent Name',
        type: 'text',
        required: true,
        placeholder: 'Full name of person making the affidavit',
      },
      {
        id: 'deponentAddress',
        label: 'Deponent Address',
        type: 'textarea',
        required: true,
        placeholder: 'Complete address of the deponent',
      },
      {
        id: 'purpose',
        label: 'Purpose of Affidavit',
        type: 'select',
        required: true,
        options: [
          'Proof of Residence',
          'Name Change',
          'Loss of Documents',
          'Income Declaration',
          'Other'
        ],
      },
      {
        id: 'statements',
        label: 'Statements/Facts',
        type: 'textarea',
        required: true,
        placeholder: 'Enter the facts or statements to be sworn',
      },
      {
        id: 'place',
        label: 'Place of Execution',
        type: 'text',
        required: true,
        placeholder: 'City where affidavit is being executed',
      },
    ],
  },
  {
    id: 'consent-form',
    name: 'Medical Consent Form',
    category: 'healthcare',
    description: 'Create a medical consent or authorization form',
    fields: [
      {
        id: 'patientName',
        label: 'Patient Name',
        type: 'text',
        required: true,
        placeholder: 'Full name of the patient',
      },
      {
        id: 'patientDOB',
        label: 'Date of Birth',
        type: 'date',
        required: true,
      },
      {
        id: 'procedure',
        label: 'Medical Procedure',
        type: 'textarea',
        required: true,
        placeholder: 'Description of the medical procedure or treatment',
      },
      {
        id: 'provider',
        label: 'Healthcare Provider',
        type: 'text',
        required: true,
        placeholder: 'Name of doctor/hospital/clinic',
      },
      {
        id: 'risks',
        label: 'Risks and Complications',
        type: 'textarea',
        required: true,
        placeholder: 'List major risks and potential complications',
      },
      {
        id: 'emergencyContact',
        label: 'Emergency Contact',
        type: 'text',
        required: true,
        placeholder: 'Name and contact number',
      },
    ],
  }
]; 