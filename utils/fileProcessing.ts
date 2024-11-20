export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFile = (file: File) => {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const errors = [];

  if (!validTypes.includes(file.type)) {
    errors.push('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.');
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push('File size exceeds 10MB limit.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getFileExtension = (filename: string) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 