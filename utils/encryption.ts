const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';

async function getKey(key: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptApiKey(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Import the key
    const key = await getKey(ENCRYPTION_KEY);
    
    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decryptApiKey(encryptedText: string): Promise<string> {
  try {
    // Convert from base64
    const data = new Uint8Array(
      atob(encryptedText)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = data.slice(0, 12);
    const encryptedData = data.slice(12);
    
    // Import the key
    const key = await getKey(ENCRYPTION_KEY);
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}