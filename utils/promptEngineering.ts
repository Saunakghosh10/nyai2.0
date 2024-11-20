export const createStructuredPrompt = (context: string, question: string) => {
  return `You are a professional document analyzer. Focus only on the following document content and answer questions directly and concisely.

DOCUMENT CONTENT:
${context}

INSTRUCTION:
- Analyze only the document content above
- Provide specific suggestions or answers based on the document
- Do not mention that you're an AI or add disclaimers
- Do not repeat the question or context
- Keep responses focused and practical

QUESTION:
${question}

RESPONSE:`;
};

export const createSystemPrompt = () => {
  return `You are a professional document analyzer with expertise in improving documents. Your responses should be:
- Direct and specific
- Based only on the provided document
- Without AI disclaimers or context repetition
- Focused on practical improvements
- Professional but conversational`;
};

export const createDocumentPrompt = (templateId: string, formData: Record<string, any>, simplifyLanguage: boolean) => {
  const templatePrompts: Record<string, string> = {
    'rental-agreement': `Create a rental agreement between landlord ${formData.landlordName} and tenant ${formData.tenantName} for the property at ${formData.propertyAddress}. The monthly rent is ${formData.rentAmount} INR, starting from ${formData.startDate} for a duration of ${formData.duration}.

Key points to include:
- Rent payment terms and due dates
- Security deposit details
- Maintenance responsibilities
- Utilities and additional charges
- Terms for termination
- Property usage restrictions`,

    'nda': `Create a Non-Disclosure Agreement between ${formData.disclosingParty} (Disclosing Party) and ${formData.receivingParty} (Receiving Party) for the purpose of ${formData.purpose}. The confidentiality obligations last for ${formData.duration} and are governed by the laws of ${formData.jurisdiction}.

Key points to include:
- Definition of confidential information
- Permitted use of information
- Return of confidential materials
- Non-circumvention provisions
- Remedies for breach
- Exclusions from confidential information`,

    'affidavit': `Create an affidavit for ${formData.deponentName}, residing at ${formData.deponentAddress}, regarding ${formData.purpose}.

The affidavit should:
- Begin with proper identification of the deponent
- Include a clear statement of facts: ${formData.statements}
- End with a verification clause
- Include place of execution: ${formData.place}
- Include standard jurat for notarization`,

    'consent-form': `Create a medical consent form for patient ${formData.patientName} (DOB: ${formData.patientDOB}) regarding ${formData.procedure} to be performed by ${formData.provider}.

The form should include:
- Description of the procedure
- Risks and complications: ${formData.risks}
- Emergency contact information: ${formData.emergencyContact}
- Authorization statement
- Right to revoke consent
- Acknowledgment of understanding`
  };

  const basePrompt = templatePrompts[templateId] || `Generate a ${templateId} document with the provided information`;
  
  return `${basePrompt}

Please create this document in ${simplifyLanguage ? 'simple, clear language avoiding legal jargon' : 'standard legal language'}.
The document should be properly structured with clear sections and maintain legal validity.

Additional requirements:
- Include all necessary legal clauses
- Use proper formatting with numbered sections
- Include date and signature blocks
- Add any relevant disclaimers
- Ensure compliance with Indian law`;
}; 